import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { HomeCategories } from 'components/Home/HomeCategories'
import { RecoilRoot } from 'recoil'

const mockSignOutFn = jest.fn()
jest.mock('common/hooks/useSearch', () => {
  return jest.fn(() => ({
    setAutoSuggest: mockSignOutFn,
  }))
})

describe('Home Categories', () => {

  it('Should render component', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const categories = container.getElementsByClassName('categories');

    expect(categories).toBeTruthy();
  })

  it('Should render All Categories icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[0];
    const iconSvg = screen.getByTestId("allCategoriesIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('All Categories');
  })

  it('Should render Services icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[1];
    const iconSvg = screen.getByTestId("servicesIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Services');
  })

  it('Should render Guides icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[2];
    const iconSvg = screen.getByTestId("guidesIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Guides');
  })

  it('Should render Rentals icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[3];
    const iconSvg = screen.getByTestId("rentalsIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Rentals');
  })

  it('Should render Marinas icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[4];
    const iconSvg = screen.getByTestId("marinasIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Marinas');
  })

  it('Should render Crew for Hire icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[5];
    const iconSvg = screen.getByTestId("crewIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Crew for Hire');
  })

  it('Should render Sales icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[6];
    const iconSvg = screen.getByTestId("salesIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Sales');
  })

  it('Should render Haul Out Service icon', () => {
    const { container } = render(
      <RecoilRoot>
        <HomeCategories onCategory={jest.fn()} iconWidth={"50"} />
      </RecoilRoot>
    )
    const category = container.getElementsByClassName('iconLabel')[7];
    const iconSvg = screen.getByTestId("haulIcon")

    expect(iconSvg).toBeTruthy();
    expect(category?.textContent).toBe('Haul Out Service');
  })

})
