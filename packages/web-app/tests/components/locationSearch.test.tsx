import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { LocationSearch } from 'components/LocationSearch/LocationSearch'
import { RecoilRoot } from 'recoil'

const mockSearchFun = jest.fn()
jest.mock('common/hooks/useSearch', () => {
  return jest.fn(() => ({
    setAutoSuggest: mockSearchFun,
    setQuery: mockSearchFun,
    suggested: [{
      id: "nearby",
      title: "Nearby",
      data: [{
        detail: "Calle Chapultepec, Coahuila",
        id: "35037",
        leftIcon: "ship",
        rightIcon: "",
        title: "JM & SAHA Arredondo"
      }]
    }]
  }))
})

beforeAll(() => {
  (global as any).google = {
    maps: {
      places: {
        Autocomplete: function () {
          return { addListener: jest.fn(), setFields: jest.fn() };
        },
        event: { trigger: jest.fn() },
      }
    }
  }

})

describe('Location Search', () => {

  it('Should render component', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const form = container.getElementsByClassName('form');

    expect(form).toBeTruthy();
  })

  it('Should render autoComplete input ', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const form = container.getElementsByClassName('autoCompleteContent');

    expect(form).toBeTruthy();
  })

  it('Should render autocomplete search icon ', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const icon = container.querySelector('.icon svg');

    expect(icon).toBeTruthy();
  })

  it('Should render suggestions on autocomplete focus', async () => {
    render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )

    act(() => {
      screen.getByTestId("input-autocomplete").focus();
    });
    await waitFor(() => {
      expect(screen.getByTestId("suggestions-list")).toBeTruthy()
    })
  })

  it('Should render autocomplete input "Find" label ', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const labelText = container.querySelector('.autoCompleteInput .label');

    expect(labelText?.textContent).toBe('Find');
  })

  it('Should render location input ', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const form = container.getElementsByClassName('search-location-input');

    expect(form).toBeTruthy();
  })

  it('Should render location input "Near" label ', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const labelText = container.querySelector('.locationInput .label');

    expect(labelText?.textContent).toBe('Near');
  })

  it('Should render location input arrow icon ', () => {
    const { container } = render(
      <RecoilRoot>
        <LocationSearch onSearch={() => jest.fn()} />
      </RecoilRoot>
    )
    const icon = container.querySelector('.icon svg');

    expect(icon).toBeTruthy();
  })
})
