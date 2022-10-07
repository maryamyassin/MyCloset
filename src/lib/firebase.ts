import { getApps, initializeApp, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore' 
import { getDatabase } from 'firebase/database' 
import firebase from 'firebase/app'
import { getStorage } from 'firebase/storage';

import FIREBASE_CONFIG from './firebase-config'

let app
if (getApps().length === 0) {
  app = initializeApp(FIREBASE_CONFIG)
} else {
  app = getApp()
}

export const storage = getStorage(app, 'gs://mycloset-3ff94.appspot.com/')
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const db = getDatabase(app)

