import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { HomeWelcome } from 'components/Home/HomeWelcome'
import { RecoilRoot } from 'recoil'

const welcomeText = `Thank you for visiting the site! Boaters List was started by water and boat enthusiasts and designed to link everyone to everything on the water. As a new company we are striving to enhance your experience, create better and faster connections and get you hooked up. Please let us know how we can improve your experience, ideas, suggestions and of course any concerns.Welcome Aboard and we look forward to seeing you on the water.`

describe('Home Welcome', () => {

  it('Should render component', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeWelcome />
      </RecoilRoot>
    )
    const welcome = container.querySelector('.welcomeContainer');

    expect(welcome).toBeTruthy();
  })

  it('Should render welcome header', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeWelcome />
      </RecoilRoot>
    )
    const welcome: any = container.querySelector('.welcomeHeader');

    expect(welcome.textContent).toBe("Welcome Aboard!");
  })

  it('Should render welcome main section', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeWelcome />
      </RecoilRoot>
    )
    const welcome: any = container.querySelector('.welcomeMain');

    expect(welcome.textContent).toBe(welcomeText);
  })

})
