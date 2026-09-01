// import { Link } from "react-router-dom";

// export default function DashboardCard({ icon: Icon, label, count, to, bgColor, borderColor, textColor }) {
//   return (
//     <Link to={to} className="w-[30%] hover:scale-105 transition-transform duration-200">
//       <div className={`shadow border px-2 xl:px-2 py-3 xl:py-4 rounded flex flex-col space-y-2 justify-center items-center h-[90%] ${bgColor} ${borderColor} ${textColor}`}>
//         {Icon && <Icon className="text-3xl xl:text-4xl" />}
//         <p className="text-lg xl:text-xl font-medium text-center">{label}</p>
//         <p className="text-lg xl:text-xl font-medium">{count}</p>
//       </div>
//     </Link>
//   );
// }

import { Link } from "react-router-dom";
import { HiArrowUpRight } from "react-icons/hi2";

export default function DashboardCard({
  icon: Icon,
  label,
  count,
  to,
  bgColor,
  borderColor,
  textColor,
}) {
  return (
    <Link
      to={to}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        transition-all
        duration-500
        hover:-translate-y-1
      "
    >
      <div
        className={`
          relative
          min-h-[185px]
          rounded-3xl
          border
          ${bgColor}
          ${borderColor}
          backdrop-blur-xl
          shadow-[0_10px_35px_rgba(0,0,0,0.06)]
          px-5
          py-5
          overflow-hidden
          transition-all
          duration-500
          group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
        `}
      >

        {/* Glow */}
        <div
          className="
            absolute
            -top-10
            -right-10
            w-32
            h-32
            bg-white/20
            rounded-full
            blur-3xl
          "
        />

        {/* Top Row */}
        <div className="flex items-start justify-between relative z-10">

          {/* Icon */}
          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-white/70
              backdrop-blur-md
              flex
              items-center
              justify-center
              shadow-md
              border
              border-white/60
            "
          >
            {Icon && (
              <Icon
                className={`
                  text-3xl
                  ${textColor}
                `}
              />
            )}
          </div>

          {/* Arrow */}
          <div
            className="
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-300
              translate-x-2
              group-hover:translate-x-0
            "
          >
            <HiArrowUpRight
              className={`
                text-2xl
                ${textColor}
              `}
            />
          </div>

        </div>

        {/* Content */}
        <div className="mt-8 relative z-10">

          <p
            className="
              text-sm
              xl:text-base
              font-medium
              text-gray-600
              tracking-wide
            "
          >
            {label}
          </p>

          <h2
            className={`
              mt-2
              text-3xl
              xl:text-4xl
              font-extrabold
              tracking-tight
              ${textColor}
            `}
          >
            {count}
          </h2>

        </div>

        {/* Bottom Shine */}
        <div
          className="
            absolute
            bottom-0
            left-0
            w-full
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-white/80
            to-transparent
          "
        />

      </div>
    </Link>
  );
}
