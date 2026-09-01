// import { Link } from "react-router-dom";

// export default function ProductServiceDashCard({ icon: Icon, label, count, to, bgColor, borderColor, textColor }) {
//   return (
//     <Link to={to} className="w-[30%] hover:scale-105 transition-transform duration-200">
//       <div className={`shadow-inner border-2 px-1 xl:px-3 py-3 xl:py-4 rounded flex flex-col space-y-1 justify-center items-center h-[90%] ${bgColor} ${borderColor} ${textColor}`}>
//         {Icon && <Icon className="text-3xl xl:text-4xl" />}
//         <p className="text-lg xl:text-xl font-medium text-center">{label}</p>
//         <p className="text-lg xl:text-xl font-medium">{count}</p>
//       </div>
//     </Link>
//   );
// }

import { HiArrowTrendingUp } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

export default function ProductServiceDashCard({
  icon: Icon,
  label,
  count,
  bgColor,
  borderColor,
  textColor,
  path,
}) {
  const navigate=useNavigate();
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        ${bgColor}
        ${borderColor}
        min-h-[185px]
        px-5
        py-5
        shadow-[0_10px_35px_rgba(0,0,0,0.06)]
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)]
      `}

      onClick={() => path && navigate(path)}
    >

      {/* Decorative Glow */}
      <div
        className="
          absolute
          top-[-40px]
          right-[-40px]
          w-36
          h-36
          bg-white/20
          rounded-full
          blur-3xl
        "
      />

      {/* Top */}
      <div className="flex items-start justify-between relative z-10">

        {/* Icon Box */}
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-white/70
            border
            border-white/60
            backdrop-blur-md
            flex
            items-center
            justify-center
            shadow-md
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

        {/* Trending Icon */}
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-white/70
            flex
            items-center
            justify-center
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >
          <HiArrowTrendingUp
            className={`
              text-lg
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

      {/* Bottom Accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          from-white/0
          via-white/90
          to-white/0
        "
      />

    </div>
  );
}
