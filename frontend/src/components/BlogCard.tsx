import React from "react";

interface Props {
  heading: string;
  fullContent: string;
  avatar: string;
  sideImage: string;
  publishedDate: string;
}
function BlogCard({
  heading,
  fullContent,
  avatar,
  sideImage,
  publishedDate,
}: Props) {
  return (
    <div className="border-b-[#444444] border-b-2 flex justify-between max-w-4xl text-[#E0E0E0] tracking-normal pb-3">
      <div className="pr-10">
          <div className="flex items-center gap-7">
            <img
              className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={avatar}
              alt=""
            />
            <div className="font-light text-white">
              <div className="flex gap-7">
                Abhilash Dash{" "}
                <span className="text-[#aba0a0]">{publishedDate}</span>
              </div>
            </div>
          </div>
          <div className="font-semibold mt-4">
            <span className="text-2xl flex-wrap break-words tracking-normal">{heading}</span>
          </div>
          <div className="text-[#aba0a0] flex-wrap break-words">
            {fullContent.slice(0, 100) + "..."}
          </div>
        
        <div className="text-[#888888] mt-4">
          {Math.ceil(fullContent.length / 100) + "min Read"}
        </div>
      </div>
      <div className="hidden md:block">
        <img src={sideImage} alt="sideImage" width={"250px"} height={"250px"} />
      </div>
    </div>
  );
}

export default BlogCard;
