'use client'

import { useState } from 'react'
import useSWR from 'swr'
import BookTile from '@/components/bookTile'
import fetcher from '@/libs/swr/fetcher'
import type { Book } from '@/models/book'
import { type CustomError, isCustomError } from '@/models/errors'

const BookList = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const { data, error } = useSWR<{ books: Book[] } | CustomError>(
    `/api/books/search?q=${searchKeyword}`,
    fetcher,
  )
  if (error) {
    console.error(error)
  }

  return (
    <>
      <div>
        <form className="flex gap-4">
          <div>
            <select className="select">
              <option value="">全ての保管場所</option>
              <option value="1">1階 エントランス</option>
              <option value="2">2階 開発室</option>
              <option value="3">3階 会議室</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="input w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                role="img"
                arial-label="search"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </g>
              </svg>
              <input
                type="search"
                placeholder="書籍のタイトルで検索"
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
            </label>
          </div>

          {/*<div className="w-full">*/}
          {/*  <input*/}
          {/*    type="search"*/}
          {/*    className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500"*/}
          {/*    placeholder="書籍のタイトルで検索"*/}
          {/*    onChange={(event) => setSearchKeyword(event.target.value)}*/}
          {/*  />*/}
          {/*</div>*/}
        </form>
      </div>

      <div className="mt-10  gap-6 flex flex-wrap max-w-full">
        {!data ? (
          <div>Loading...</div>
        ) : error || isCustomError(data) ? (
          <div>Error!</div>
        ) : (
          data.books.map((book) => {
            return (
              <div key={book.id}>
                <BookTile book={book} />
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

export default BookList
