import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <FaceExpression />
      <Player />
    </div>
  )
}

export default Home
