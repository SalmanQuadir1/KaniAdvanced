import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-sm border flex flex-row items-center border-stroke md:h-[110px] md:w-[220px] bg-white py-6 px-3 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-15 w-[80px] md:w-[80px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex flex-row  justify-end ml-[60px]">
        <div>
          <h4 className="text-title-md font-bold text-slate-800 mt-[-50px] dark:text-white text-center">
            {total}
          </h4>
        </div>

   
      </div>
      <div>

      <h2 className="text-xs font-semibold mt-[50px] ml-[-47px]">{title}</h2>
      </div>
    </div>
  );
};

export default CardDataStats;
