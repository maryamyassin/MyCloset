import { GeoPoint, Timestamp } from '@firebase/firestore'

type ID = string

export enum Swipe {
  Left,
  Right,
}

export type User = {
  id: ID
  name: string

  // demographics
  age: number
  nationality: string
  //location: string
  gender: string
  languages: string[]

  swipeHistory: { shirteventId: string; bottomeventId: string; swipe: Swipe }[]

  groups: ID[]
  closet: { link: string; name: string; typetag: string; swipes: number}[]
}

export type GroupMessage = {
  senderId: ID
  timestamp: Timestamp
  contents: string
}

export type Group = {
  id: ID
  eventId: ID
  eventName: string // to short-circuit an extra fetch through eventId
  members: { userId: ID; typing: boolean }[]
  messages: GroupMessage[]
}

export type EventReview = {
  authorId: ID
  rating: number
  contents: string
}

export type Event = {
  id: ID
  coords: GeoPoint

  name: string
  description: string

  images: string[]
  tags: string[]

  minPeople: number
  maxPeople: number
  groups: ID[]

  swipes: { userId: ID; swipe: Swipe }[]
  reviews: EventReview[]
}
