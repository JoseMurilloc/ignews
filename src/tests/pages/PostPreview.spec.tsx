import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getPrimiscClient } from '../../services/prismic'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

const post ={ 
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post excerpt</p>',
  updatedAt: '01 de abril de 2021',
}

jest.mock('next-auth/client')

describe('Posts Preview page', () => {
  it ('render correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <Post post={post} />
    )

    expect(
      screen.getByText('Wanna continue reading?')
    ).toBeInTheDocument()
    expect(screen.getByText('My new post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it ('redirect user to full post when user is subscribe', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: 'fake-active-subscription'
    }, false] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Post post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
    
    const getPrimiscClientMocked = mocked(getPrimiscClient)

    getPrimiscClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: { 
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)


    const response = await getStaticProps({
      params: { slug: 'my-new-post'}
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )

  })
})