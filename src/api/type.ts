export interface resItemData {
  item: {
    id: number
    [key: string]: any
  }
}

export interface resItemsData {
  items: [],
  total: number
}

export interface loginForm {
  username: string,
  password: string
}
