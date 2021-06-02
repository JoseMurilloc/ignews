import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getPrimiscClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'

const posts = [
  { 
    slug: 'my-new-post',
    title: 'My new post',
    excerpt: 'Post excerpt',
    updatedAt: '01 de abril de 2021',
  }
]

describe('Posts page', () => {
  it ('render correctly', () => {
    render(
      <Posts posts={posts} />
    )

    expect(screen.getByText('My new post')).toBeInTheDocument()
  })

  it ('loads initial data', async () => {
    const getPrimiscClientMocked = mocked(getPrimiscClient)

    getPrimiscClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: { 
              title: [
                { type: 'heading', text: 'My new post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post expect'}
              ],
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            excerpt: 'Post expect',
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    )
  })
})