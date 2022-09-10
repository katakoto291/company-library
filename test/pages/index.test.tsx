import { render } from '@testing-library/react'
import Layout from '@/components/layout'
import { bookWithImage } from '../__utils__/data/book'

jest.mock('@/components/layout')

describe('index page', () => {
  const useGetBooksQueryMock = jest
    .spyOn(require('@/generated/graphql.client'), 'useGetBooksQuery')
    .mockReturnValue([
      {
        fetching: false,
        error: false,
        data: {
          books: [bookWithImage],
        },
      },
    ])

  const LayoutMock = (Layout as jest.Mock).mockImplementation(({ children }) => {
    return <div>{children}</div>
  })

  const TopPage = require('@/pages/index').default

  it('本の一覧が新着順に表示される', () => {
    const { getByText } = render(<TopPage />)

    expect(LayoutMock.mock.calls[0][0].title).toBe('トップページ | company-library')
    expect(getByText('新着')).toBeInTheDocument()
    expect(getByText(bookWithImage.title)).toBeInTheDocument()
  })

  it('本の一覧の読み込み中は「Loading...」と表示される', () => {
    useGetBooksQueryMock.mockReturnValueOnce([{ fetching: true }])

    const { getByText } = render(<TopPage />)

    expect(getByText('Loading...')).toBeInTheDocument()
  })

  it('本の一覧の読み込みに失敗した場合、「Error!」と表示される', () => {
    useGetBooksQueryMock.mockReturnValueOnce([{ fetching: false, error: true }])
    const { getByText, rerender } = render(<TopPage />)
    expect(getByText('Error!')).toBeInTheDocument()

    useGetBooksQueryMock.mockReturnValueOnce([{ fetching: false, error: false, data: undefined }])
    rerender(<TopPage />)
    expect(getByText('Error!')).toBeInTheDocument()
  })
})
