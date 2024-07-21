import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <h1 className="text-center text-9xl font-bold">404</h1>
      <p className="mt-4 text-xl">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="mt-6 text-primary">
        Go back to the home page
      </Link>
    </div>
  );
};
