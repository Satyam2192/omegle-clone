import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link href="/chat" legacyBehavior>
        <a className="p-4 bg-blue-500 text-white rounded-md">Start Chat</a>
      </Link>
    </div>
  );
};

export default HomePage;
