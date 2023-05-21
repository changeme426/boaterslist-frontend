import * as React from "react"
import Svg, { SvgProps, G, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={1734}
    height={1115}
    viewBox="0 0 1734 1115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#a)">
      <Path
        d="M247 510.5C317.873 234.21 568.571 30 866.966 30c298.394 0 549.094 204.21 619.964 480.5"
        stroke="#FEDD14"
        strokeWidth={40}
        strokeLinecap="round"
      />
      <Path
        d="M227 808h1280M387 935h960m-690 130h420"
        stroke="#3798E2"
        strokeWidth={40}
        strokeLinecap="round"
      />
      <Path
        d="M105.12 737.152c-14.976 0-28.416-3.456-40.32-10.368-11.904-7.104-21.312-16.704-28.224-28.8-6.912-12.096-10.464-25.728-10.656-40.896V525.76c0-4.416 1.344-7.968 4.032-10.656 2.88-2.688 6.432-4.032 10.656-4.032 4.416 0 7.968 1.344 10.656 4.032 2.688 2.688 4.032 6.24 4.032 10.656v77.76c6.72-8.064 14.784-14.4 24.192-19.008 9.6-4.8 20.064-7.2 31.392-7.2 14.016 0 26.592 3.552 37.728 10.656 11.136 6.912 19.872 16.416 26.208 28.512 6.528 11.904 9.792 25.44 9.792 40.608 0 15.168-3.552 28.8-10.656 40.896-6.912 12.096-16.32 21.696-28.224 28.8-11.904 6.912-25.44 10.368-40.608 10.368Zm0-25.92c9.792 0 18.528-2.304 26.208-6.912 7.68-4.8 13.728-11.328 18.144-19.584 4.608-8.256 6.912-17.472 6.912-27.648 0-10.368-2.304-19.584-6.912-27.648-4.416-8.064-10.464-14.4-18.144-19.008-7.68-4.8-16.416-7.2-26.208-7.2-9.6 0-18.336 2.4-26.208 7.2-7.68 4.608-13.728 10.944-18.144 19.008-4.416 8.064-6.624 17.28-6.624 27.648 0 10.176 2.208 19.392 6.624 27.648 4.416 8.256 10.464 14.784 18.144 19.584 7.872 4.608 16.608 6.912 26.208 6.912Zm194.724 25.92c-15.552 0-29.28-3.36-41.184-10.08-11.904-6.912-21.312-16.32-28.224-28.224-6.72-12.096-10.08-25.92-10.08-41.472 0-15.744 3.36-29.568 10.08-41.472 6.912-12.096 16.32-21.504 28.224-28.224 11.904-6.912 25.632-10.368 41.184-10.368 15.36 0 28.992 3.456 40.896 10.368 11.904 6.72 21.216 16.128 27.936 28.224 6.912 11.904 10.368 25.728 10.368 41.472 0 15.552-3.36 29.376-10.08 41.472-6.72 11.904-16.032 21.312-27.936 28.224-11.904 6.72-25.632 10.08-41.184 10.08Zm0-25.92c9.984 0 18.816-2.304 26.496-6.912 7.68-4.608 13.632-10.944 17.856-19.008 4.416-8.064 6.624-17.376 6.624-27.936 0-10.56-2.208-19.872-6.624-27.936-4.224-8.256-10.176-14.688-17.856-19.296-7.68-4.608-16.512-6.912-26.496-6.912-9.984 0-18.816 2.304-26.496 6.912-7.68 4.608-13.728 11.04-18.144 19.296-4.416 8.064-6.624 17.376-6.624 27.936 0 10.56 2.208 19.872 6.624 27.936 4.416 8.064 10.464 14.4 18.144 19.008 7.68 4.608 16.512 6.912 26.496 6.912Zm188.584 25.92c-14.016 0-26.592-3.456-37.728-10.368-11.136-7.104-19.968-16.608-26.496-28.512-6.336-12.096-9.504-25.728-9.504-40.896s3.456-28.8 10.368-40.896c7.104-12.096 16.608-21.6 28.512-28.512 12.096-7.104 25.632-10.656 40.608-10.656 14.976 0 28.416 3.552 40.32 10.656 11.904 6.912 21.312 16.416 28.224 28.512 7.104 12.096 10.656 25.728 10.656 40.896V721.6c0 4.224-1.44 7.776-4.32 10.656-2.688 2.688-6.144 4.032-10.368 4.032s-7.776-1.344-10.656-4.032c-2.688-2.88-4.032-6.432-4.032-10.656v-10.656c-6.72 8.064-14.88 14.496-24.48 19.296-9.408 4.608-19.776 6.912-31.104 6.912Zm5.76-25.92c9.792 0 18.528-2.304 26.208-6.912 7.68-4.8 13.728-11.232 18.144-19.296 4.416-8.256 6.624-17.472 6.624-27.648 0-10.368-2.208-19.584-6.624-27.648-4.416-8.256-10.464-14.688-18.144-19.296-7.68-4.8-16.416-7.2-26.208-7.2-9.6 0-18.336 2.4-26.208 7.2-7.68 4.608-13.824 11.04-18.432 19.296-4.416 8.064-6.624 17.28-6.624 27.648 0 10.176 2.208 19.392 6.624 27.648 4.608 8.064 10.752 14.496 18.432 19.296 7.872 4.608 16.608 6.912 26.208 6.912ZM674.42 736c-9.6 0-18.24-2.4-25.92-7.2-7.68-4.992-13.728-11.712-18.144-20.16-4.416-8.448-6.624-17.952-6.624-28.512v-71.136h-13.248c-4.032 0-7.296-1.152-9.793-3.456-2.495-2.304-3.743-5.184-3.743-8.64 0-3.84 1.248-6.912 3.743-9.216 2.497-2.304 5.761-3.456 9.793-3.456h13.248v-41.472c0-4.224 1.344-7.68 4.032-10.368 2.688-2.688 6.144-4.032 10.368-4.032s7.68 1.344 10.368 4.032c2.688 2.688 4.032 6.144 4.032 10.368v41.472h24.48c4.032 0 7.296 1.152 9.792 3.456 2.496 2.304 3.744 5.376 3.744 9.216 0 3.456-1.248 6.336-3.744 8.64-2.496 2.304-5.76 3.456-9.792 3.456h-24.48v71.136c0 7.68 2.112 14.112 6.336 19.296 4.224 5.184 9.408 7.776 15.552 7.776h9.792c3.456 0 6.336 1.344 8.64 4.032 2.496 2.688 3.744 6.144 3.744 10.368s-1.632 7.68-4.896 10.368c-3.072 2.688-7.104 4.032-12.096 4.032h-5.184Zm132.297 1.152c-15.936 0-30.144-3.36-42.624-10.08-12.288-6.912-21.984-16.32-29.088-28.224-6.912-12.096-10.368-25.92-10.368-41.472 0-15.744 3.264-29.568 9.792-41.472 6.72-12.096 15.936-21.504 27.648-28.224 11.712-6.912 25.152-10.368 40.32-10.368 14.976 0 27.84 3.36 38.592 10.08 10.752 6.528 18.912 15.648 24.48 27.36 5.76 11.52 8.64 24.864 8.64 40.032 0 3.648-1.248 6.72-3.744 9.216-2.496 2.304-5.664 3.456-9.504 3.456h-109.44c2.112 13.248 8.16 24.096 18.144 32.544 10.176 8.256 22.56 12.384 37.152 12.384 5.952 0 12-1.056 18.144-3.168 6.336-2.304 11.424-4.896 15.264-7.776 2.88-2.112 5.952-3.168 9.216-3.168 3.456-.192 6.432.768 8.928 2.88 3.264 2.88 4.992 6.048 5.184 9.504.192 3.456-1.344 6.432-4.608 8.928-6.528 5.184-14.688 9.408-24.48 12.672-9.6 3.264-18.816 4.896-27.648 4.896Zm-4.32-135.072c-14.208 0-25.632 3.936-34.272 11.808-8.64 7.872-14.112 18.048-16.416 30.528h95.904c-1.728-12.288-6.432-22.368-14.112-30.24-7.68-8.064-18.048-12.096-31.104-12.096ZM925.976 736c-9.6 0-14.4-4.8-14.4-14.4V592.864c0-9.6 4.8-14.4 14.4-14.4 9.6 0 14.4 4.8 14.4 14.4v5.472c5.76-6.72 12.768-12 21.024-15.84 8.448-3.84 17.568-5.76 27.36-5.76 11.52 0 20.06 1.92 25.63 5.76 5.76 3.648 7.97 8.064 6.63 13.248-.96 4.032-2.88 6.72-5.76 8.064-2.88 1.152-6.24 1.344-10.08.576-12.292-2.496-23.332-2.688-33.124-.576-9.792 2.112-17.568 6.048-23.328 11.808-5.568 5.76-8.352 13.056-8.352 21.888V721.6c0 9.6-4.8 14.4-14.4 14.4Zm182.974 1.152c-13.44 0-25.92-2.016-37.44-6.048-11.33-4.224-20.16-9.504-26.5-15.84-2.88-3.072-4.12-6.528-3.74-10.368.58-4.032 2.5-7.296 5.76-9.792 3.84-3.072 7.58-4.32 11.23-3.744 3.84.384 7.11 2.016 9.79 4.896 3.27 3.648 8.45 7.104 15.56 10.368 7.29 3.072 15.36 4.608 24.19 4.608 11.13 0 19.58-1.824 25.34-5.472 5.95-3.648 9.03-8.352 9.22-14.112.19-5.76-2.59-10.752-8.35-14.976-5.57-4.224-15.84-7.68-30.82-10.368-19.39-3.84-33.5-9.6-42.34-17.28-8.64-7.68-12.96-17.088-12.96-28.224 0-9.792 2.88-17.856 8.64-24.192 5.76-6.528 13.16-11.328 22.18-14.4 9.02-3.264 18.43-4.896 28.22-4.896 12.68 0 23.91 2.016 33.7 6.048 9.79 4.032 17.57 9.6 23.33 16.704 2.69 3.072 3.93 6.336 3.74 9.792-.19 3.264-1.82 6.048-4.89 8.352-3.08 2.112-6.72 2.784-10.95 2.016-4.22-.768-7.77-2.496-10.65-5.184-4.8-4.608-9.99-7.776-15.56-9.504-5.56-1.728-12-2.592-19.29-2.592-8.45 0-15.65 1.44-21.6 4.32-5.76 2.88-8.64 7.104-8.64 12.672 0 3.456.86 6.624 2.59 9.504 1.92 2.688 5.57 5.184 10.94 7.488 5.38 2.112 13.25 4.224 23.62 6.336 21.7 4.224 36.67 10.272 44.93 18.144 8.45 7.68 12.67 17.184 12.67 28.512 0 8.832-2.4 16.8-7.2 23.904-4.61 7.104-11.52 12.768-20.74 16.992-9.02 4.224-20.35 6.336-33.98 6.336ZM1329.83 736c-8.45 0-15.94-2.304-22.47-6.912-6.52-4.608-11.61-10.848-15.26-18.72-3.65-8.064-5.47-17.28-5.47-27.648V525.472c0-4.224 1.34-7.68 4.03-10.368 2.69-2.688 6.14-4.032 10.37-4.032 4.22 0 7.68 1.344 10.37 4.032 2.68 2.688 4.03 6.144 4.03 10.368V682.72c0 7.104 1.34 12.96 4.03 17.568 2.69 4.608 6.14 6.912 10.37 6.912h7.2c3.84 0 6.91 1.344 9.21 4.032 2.5 2.688 3.75 6.144 3.75 10.368s-1.83 7.68-5.47 10.368c-3.65 2.688-8.36 4.032-14.12 4.032h-.57Zm66.47 0c-4.22 0-7.78-1.344-10.66-4.032-2.68-2.88-4.03-6.432-4.03-10.656v-128.16c0-4.416 1.35-7.968 4.03-10.656 2.88-2.688 6.44-4.032 10.66-4.032 4.42 0 7.97 1.344 10.66 4.032 2.68 2.688 4.03 6.24 4.03 10.656v128.16c0 4.224-1.35 7.776-4.03 10.656-2.69 2.688-6.24 4.032-10.66 4.032Zm0-183.168c-5.18 0-9.7-1.824-13.54-5.472-3.64-3.84-5.47-8.352-5.47-13.536 0-5.184 1.83-9.6 5.47-13.248 3.84-3.84 8.36-5.76 13.54-5.76s9.6 1.92 13.25 5.76c3.84 3.648 5.76 8.064 5.76 13.248 0 5.184-1.92 9.696-5.76 13.536-3.65 3.648-8.07 5.472-13.25 5.472Zm126.65 184.32c-13.44 0-25.92-2.016-37.44-6.048-11.33-4.224-20.16-9.504-26.5-15.84-2.88-3.072-4.12-6.528-3.74-10.368.58-4.032 2.5-7.296 5.76-9.792 3.84-3.072 7.58-4.32 11.23-3.744 3.84.384 7.11 2.016 9.79 4.896 3.27 3.648 8.45 7.104 15.56 10.368 7.29 3.072 15.36 4.608 24.19 4.608 11.13 0 19.58-1.824 25.34-5.472 5.95-3.648 9.03-8.352 9.22-14.112.19-5.76-2.59-10.752-8.35-14.976-5.57-4.224-15.84-7.68-30.82-10.368-19.39-3.84-33.5-9.6-42.34-17.28-8.64-7.68-12.96-17.088-12.96-28.224 0-9.792 2.88-17.856 8.64-24.192 5.76-6.528 13.16-11.328 22.18-14.4 9.02-3.264 18.43-4.896 28.22-4.896 12.68 0 23.91 2.016 33.7 6.048 9.79 4.032 17.57 9.6 23.33 16.704 2.69 3.072 3.93 6.336 3.74 9.792-.19 3.264-1.82 6.048-4.89 8.352-3.08 2.112-6.72 2.784-10.95 2.016-4.22-.768-7.77-2.496-10.65-5.184-4.8-4.608-9.99-7.776-15.56-9.504-5.56-1.728-12-2.592-19.29-2.592-8.45 0-15.65 1.44-21.6 4.32-5.76 2.88-8.64 7.104-8.64 12.672 0 3.456.86 6.624 2.59 9.504 1.92 2.688 5.57 5.184 10.94 7.488 5.38 2.112 13.25 4.224 23.62 6.336 21.7 4.224 36.67 10.272 44.93 18.144 8.45 7.68 12.67 17.184 12.67 28.512 0 8.832-2.4 16.8-7.2 23.904-4.61 7.104-11.52 12.768-20.74 16.992-9.02 4.224-20.35 6.336-33.98 6.336ZM1679.33 736c-9.6 0-18.24-2.4-25.92-7.2-7.68-4.992-13.73-11.712-18.15-20.16-4.41-8.448-6.62-17.952-6.62-28.512v-71.136h-13.25c-4.03 0-7.3-1.152-9.79-3.456-2.5-2.304-3.75-5.184-3.75-8.64 0-3.84 1.25-6.912 3.75-9.216 2.49-2.304 5.76-3.456 9.79-3.456h13.25v-41.472c0-4.224 1.34-7.68 4.03-10.368 2.69-2.688 6.14-4.032 10.37-4.032 4.22 0 7.68 1.344 10.37 4.032 2.68 2.688 4.03 6.144 4.03 10.368v41.472h24.48c4.03 0 7.29 1.152 9.79 3.456 2.5 2.304 3.74 5.376 3.74 9.216 0 3.456-1.24 6.336-3.74 8.64-2.5 2.304-5.76 3.456-9.79 3.456h-24.48v71.136c0 7.68 2.11 14.112 6.33 19.296 4.23 5.184 9.41 7.776 15.56 7.776h9.79c3.45 0 6.33 1.344 8.64 4.032 2.49 2.688 3.74 6.144 3.74 10.368s-1.63 7.68-4.89 10.368c-3.08 2.688-7.11 4.032-12.1 4.032h-5.18Z"
        fill="#fff"
      />
    </G>
    <Defs></Defs>
  </Svg>
)

export default SvgComponent
