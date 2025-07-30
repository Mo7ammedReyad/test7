
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore'

const app = new Hono()

// تفعيل CORS لكل المسارات
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type']
}))

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC07Gs8L5vxlUmC561PKbxthewA1mrxYDk",
  authDomain: "zylos-test.firebaseapp.com",
  databaseURL: "https://zylos-test-default-rtdb.firebaseio.com",
  projectId: "zylos-test",
  storageBucket: "zylos-test.firebasestorage.app",
  messagingSenderId: "553027007913",
  appId: "1:553027007913:web:2daa37ddf2b2c7c20b00b8"
};

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

app.post('/signup', async (c) => {
  const { email, password } = await c.req.json()
  const usersRef = collection(db, 'users')
  await addDoc(usersRef, { email, password })
  return c.json({ message: 'User registered successfully' })
})

app.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email), where('password', '==', password))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return c.json({ success: false, message: 'Invalid credentials' }, 401)
  } else {
    return c.json({ success: true, message: 'Login successful' })
  }
})

app.get('/', (c) => c.text('Server is running'))

export default app
