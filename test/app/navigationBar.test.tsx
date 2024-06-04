import { render, screen } from '@testing-library/react'
import { user1 } from '../__utils__/data/user'
import { Suspense } from 'react'

const pathnameMock = vi.fn().mockReturnValue({ push: vi.fn() })
vi.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => pathnameMock(),
}))

const loggedInUser = user1
const getServerSessionMock = vi.fn().mockReturnValue({
  customUser: { id: loggedInUser.id, name: loggedInUser.name, email: loggedInUser.email },
})
vi.mock('next-auth', () => ({
  __esModule: true,
  getServerSession: () => getServerSessionMock(),
}))

vi.mock('@/app/api/auth/[...nextauth]/route', () => ({
  __esModule: true,
  authOptions: {},
}))

const UserAvatarMock = vi.fn().mockImplementation(() => <div>userAvatar</div>)
vi.mock('@/components/userAvatar', () => ({
  __esModule: true,
  default: (...args: any) => UserAvatarMock(...args),
}))

describe('navigationBar component', async () => {
  const NavigationBar = (await import('@/app/navigationBar')).default

  it('ナビゲーション項目が表示される', async () => {
    render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    expect(await screen.findByText('company-library')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '書籍一覧' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '書籍一覧' })).not.toHaveClass('bg-gray-600')
    expect(screen.getByRole('link', { name: '登録' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '登録' })).not.toHaveClass('bg-gray-600')
    expect(screen.getByRole('link', { name: 'マイページ' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'マイページ' })).not.toHaveClass('bg-gray-600')
    expect(screen.getByRole('link', { name: '利用者一覧' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '利用者一覧' })).not.toHaveClass('bg-gray-600')
    expect(screen.getByText(loggedInUser.name)).toBeInTheDocument()
  })

  it('company-libraryをクリックすると書籍一覧画面へ遷移する', async () => {
    render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByText('company-library')).toHaveAttribute('href', '/')
  })

  it('pathが/の場合、書籍一覧ボタンのデザインが強調される', async () => {
    pathnameMock.mockReturnValue('/')

    render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByRole('link', { name: '書籍一覧' })).toHaveClass('bg-gray-600')
  })

  it('pathが/books/registerの場合、登録ボタンのデザインが強調される', async () => {
    pathnameMock.mockReturnValue('/books/register')

    render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByRole('link', { name: '登録' })).toHaveClass('bg-gray-600')
  })

  it('pathが/usersの場合、利用者一覧ボタンのデザインが強調される', async () => {
    pathnameMock.mockReturnValue('/users')

    render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByRole('link', { name: '利用者一覧' })).toHaveClass('bg-gray-600')
  })

  it('pathが/users/ログインユーザーのidの場合、マイページボタンのデザインが強調される', async () => {
    pathnameMock.mockReturnValue(`/users/${loggedInUser.id}`)

    const { rerender } = render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByRole('link', { name: 'マイページ' })).toHaveClass('bg-gray-600')

    // ログインユーザー以外のIDの場合強調されない
    pathnameMock.mockReturnValue({
      push: vi.fn(),
      asPath: `/users/${loggedInUser.id + 1}`,
    })
    rerender(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByRole('link', { name: 'マイページ' })).not.toHaveClass('bg-gray-600')
  })

  it('ログインユーザーのアバターが表示される', async () => {
    render(
      <Suspense>
        <NavigationBar />
      </Suspense>,
    )

    // Suspenseの解決を待つために、最初のテスト項目のみawaitを使う
    expect(await screen.findByText('userAvatar')).toBeInTheDocument()
    expect(UserAvatarMock).toHaveBeenLastCalledWith(
      {
        user: { id: loggedInUser.id, name: loggedInUser.name, email: loggedInUser.email },
        size: 'sm',
      },
      undefined,
    )
  })
})
