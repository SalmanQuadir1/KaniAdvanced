import { Link } from 'react-router-dom';

const Breadcrumb = ({ pageName }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {/* {pageName} */}
      </h2>

      <nav>
        <ol className="flex  items-center md:gap-2 gap-5">
          <li>
            <Link className="md:font-medium font-sm" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="md:font-medium font-xs text-sm text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
