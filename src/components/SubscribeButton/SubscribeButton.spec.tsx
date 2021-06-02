import { fireEvent, render, screen } from '@testing-library/react'
import { SubscribeButton } from '.'
import { signIn, useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router';

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])


    render(
      <SubscribeButton />
    )
  
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirect user to signIn when not authenticated', () => {

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    const signInMocked = mocked(signIn)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it ('redirects tp posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()
    const subscribeButton = screen.getByText('Subscribe Now')
    const useSessionMocked = mocked(useSession)
    
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    useSessionMocked.mockReturnValueOnce([
      { 
        user: {
          name: 'John Doe',
          email: 'john.doe@gmail.com'
        }, 
        activeSubscription: 'Fake-active-activeSubscription',
        expires: 'fake-exp'
      }, 
      false
    ])
    render(<SubscribeButton />)
    
    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalled()
  })
})
