import React from 'react';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Welcome to Next.js with TypeScript</h1>
    </div>
  );
};

export default Home;
