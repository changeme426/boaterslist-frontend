import { render, screen } from '@testing-library/react'
import Header from 'components/Common/Header'
import { RecoilRoot } from 'recoil'

let container: any;

import "@testing-library/jest-dom/extend-expect";


jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: () => {
    return {
      isLoading: false,
      error: false,
      user: null,
      isAuthenticated: false,
      loginWithRedirect: jest.fn()
    }
  }
}));

jest.mock(
  "next/image",
  () =>
    function Image({ src, alt }: any) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} />
    },
)

beforeEach(() => {
  container = render(
    <RecoilRoot>
      <Header />
    </RecoilRoot>
  ).container
})

describe('Header', () => {

  it('Should render component', () => {
    const header = container.querySelector('.header');

    expect(header).toBeTruthy();
  })

  it('Should render boaterslist logo', () => {
    const img = container.getElementsByTagName('img');

    expect(img).toBeTruthy();
  })

  it('Should redirect to home if logo is cliked', () => {
    const link = container.querySelector('.imageLink');

    expect(link).toHaveAttribute('href', '/');
  })

  it('Should render the Dock link', () => {
    const link = container.querySelector('.theDock a');

    expect(link).toHaveTextContent('The Dock');
  })

  it('Should redirect to The Dock marketplace if user click The Dock', () => {
    const link = container.querySelector('.theDock a');

    expect(link).toHaveAttribute('href', 'https://thedock.boaterslist.com');
  })

  it('Should render Merchandise link', () => {
    const link = container.querySelector('.merch a');

    expect(link).toHaveTextContent('Merchandise');
  })

  it('Should redirect to The Dock marketplace if user click Merchandise', () => {
    const link = container.querySelector('.merch a');

    expect(link).toHaveAttribute('href', 'https://boaterslistmerch.com/');
  })

  it('Should render Articles & Advice link', () => {
    const link = container.querySelector('.articles a');

    expect(link).toHaveTextContent('Articles & Advice');
  })

  it('Should redirect to Articles & Advice if user click', () => {
    const link = container.querySelector('.articles a');

    expect(link).toHaveAttribute('href', '/articles');
  })

  it('Should render login button if user is not logged in', () => {
    const login = container.getElementsByClassName('btn')[0];

    expect(login).toHaveTextContent('Log In');
  })

  it('Should render Business Sign up button if user is not logged in', () => {
    const login = container.getElementsByClassName('btn')[1];

    expect(login).toHaveTextContent('Business Sign Up');
  })

  it('Should render signUp button if user is not logged in', () => {
    const signup = container.getElementsByClassName('btn')[2];

    expect(signup).toHaveTextContent('Sign Up');
  })

  // it('Should not render login button if user is logged in', () => {
  //   const login = container.getElementsByClassName('btn')[0];

  //   expect(login).toBeFalsy();
  // })

  // it('Should not render signUp button if user is logged in', () => {
  //   const signup = container.getElementsByClassName('btn')[1];

  //   expect(signup).toBeFalsy();
  // })

})
