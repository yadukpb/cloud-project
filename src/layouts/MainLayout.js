import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'

const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: '64px' }}>
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout