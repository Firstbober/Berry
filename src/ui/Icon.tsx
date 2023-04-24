export enum Icons {
  AddLine = '/icons/remixicon/add-line.svg',
  Chat1_Fill = '/icons/remixicon/chat-1-fill.svg',
  Chat1_Line = '/icons/remixicon/chat-1-line.svg',
  Compass3_Line = '/icons/remixicon/compass-3-line.svg',
  Hashtag = '/icons/remixicon/hashtag.svg',
  Home_Fill = '/icons/remixicon/home-fill.svg',
  Home_Line = '/icons/remixicon/home-line.svg',
  More_Fill = '/icons/remixicon/more-fill.svg',
  Refresh_Line = '/icons/remixicon/refresh-line.svg',
  Search_Line = '/icons/remixicon/search-line.svg',
  SendPlane2_Fill = '/icons/remixicon/send-plane-2-fill.svg',
  User3_Fill = '/icons/remixicon/user-3-fill.svg',
  User3_Line = '/icons/remixicon/user-3-line.svg',
  Menu_Fill = '/icons/remixicon/menu-line.svg'
}

export const Icon = (props: {
  src: string,
  alt: string,
  className?: string
}) => {
  return (
    <img src={props.src} alt={props.alt} class={`contrast-75 ${props.className}`} />
  )
}
