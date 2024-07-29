import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  return (
    <nav className="bg-muted p-4">
      <ul className="flex space-x-4 md:space-x-8 justify-center">
        <li>
          <Link href="/">
            <span className={router.pathname === '/' ? 'font-bold' : ''}>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/assessment">
            <span className={router.pathname === '/assessment' ? 'font-bold' : ''}>Answer</span>
          </Link>
        </li>
        <li>
          <Link href="/contribute">
            <span className={router.pathname === '/contribute' ? 'font-bold' : ''}>Ask</span>
          </Link>
        </li>
        <li>
          <Link href="/zu-village-temperature">
            <span className={router.pathname === '/zu-village-temperature' ? 'font-bold' : ''}>ZuVillage Temperature</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
