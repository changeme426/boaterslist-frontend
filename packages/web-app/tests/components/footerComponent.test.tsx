import { render } from '@testing-library/react'
import Footer from 'components/Common/Footer'
import { RecoilRoot } from 'recoil'

let container: any;

beforeEach(() => {
  container = render(
    <RecoilRoot>
      <Footer />
    </RecoilRoot>
  ).container
})

describe('Footer', () => {

  it('Should render component', () => {
    const footer = container.querySelector('.footer');

    expect(footer).toBeTruthy();
  })

  it('Should render social media icons', () => {
    const footer = container.querySelector('.socialMediaIcons');

    expect(footer).toBeTruthy();
  })

  it('Should render About link', () => {
    const tagAnchor = container.getElementsByTagName('a')[0];


    expect(tagAnchor.textContent).toBe('About');
  })

  it('Should have href property to /about-us', () => {
    const about = container.querySelector('.about');

    expect(about).toHaveAttribute('href', '/about-us');
  })

  it('Should render Contact link', () => {
    const tagAnchor = container.getElementsByTagName('a')[1]

    expect(tagAnchor.textContent).toBe('Contact');
  })

  it('Should have href property to /contact-us', () => {
    const contact = container.querySelector('.contact');

    expect(contact).toHaveAttribute('href', '/contact-us');
  })

})
