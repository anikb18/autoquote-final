import React from "react";

const WYSIWYG = () => {
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap items-center">
          <div className="flex items-center space-x-1 rtl:space-x-reverse flex-wrap">
            <button
              id="toggleBoldButton"
              data-tooltip-target="tooltip-bold"
              type="button"
              className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"
                />
              </svg>
              <span className="sr-only">Bold</span>
            </button>
            <button
              id="toggleItalicButton"
              data-tooltip-target="tooltip-italic"
              type="button"
              className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"
                />
              </svg>
              <span className="sr-only">Italic</span>
            </button>
            <button
              id="toggleUnderlineButton"
              data-tooltip-target="tooltip-underline"
              type="button"
              className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"
                />
              </svg>
              <span className="sr-only">Underline</span>
            </button>
            <button
              id="toggleStrikeButton"
              data-tooltip-target="tooltip-strike"
              type="button"
              className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.677 6.523M9.6 19l1.029-4M5 5l6.523 6.523M19 19l-7.477-7.477"
                />
              </svg>
              <span className="sr-only">Strike</span>
            </button>
          </div>
        </div>
      </div>
      <div id="textEditor" className="px-4 py-3">
        <textarea
          className="block w-full px-0 text-sm text-gray-800 bg-gray-50 border-0 dark:bg-gray-700 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Write something..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default WYSIWYG;
