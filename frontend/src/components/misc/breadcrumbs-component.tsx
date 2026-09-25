import React from "react";

export interface BreadcrumbItem {
  id: string | number;
  caption: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onClick?: (id: BreadcrumbItem["id"]) => void;
}

export const BreadCrumbsComponent
  : React.FC<BreadcrumbsProps> = ({
    items,
    onClick,
  }) => {
    return (
      <nav className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.id}>
              <span
                onClick={() => !isLast && onClick?.(item.id)}
                className={`cursor-pointer ${isLast
                    ? "text-gray-500 cursor-default"
                    : "text-blue-600 hover:underline"
                  }`}
              >
                {item.caption}
              </span>

              {!isLast && <span className="text-gray-400">/</span>}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };