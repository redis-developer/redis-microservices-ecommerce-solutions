'use client';

import { useEffect, useState } from 'react';

export default function Alert({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!!title && !!message) {
      setOpen(true);
    }

    const timeout = setTimeout(() => {
      setOpen(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [title, message]);

  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto">
      <div
        className="pointer-events-auto mx-auto mb-4 block w-96 max-w-full rounded-lg bg-orange-100 bg-clip-padding text-sm text-green-700 shadow-lg shadow-black/5"
        id="static-example"
        role="alert"
        aria-live="assertive"
        aria-atomic="true">
        <div className="flex items-center justify-between rounded-t-lg border-b-2 border-orange-200 bg-orange-100 bg-clip-padding px-4 pt-2.5 pb-2 text-green-700">
          <p className="flex items-center font-bold text-green-700">
            <svg
              aria-hidden="true"
              focusable="false"
              className="mr-2 h-4 w-4 fill-current"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
            </svg>
            {title}
          </p>
          <div className="flex items-center">
            <button
              type="button"
              className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              onClick={() => {
                setOpen(false);
              }}
              aria-label="Close">
              <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div className="break-words rounded-b-lg bg-orange-100 py-4 px-4 text-green-700">
          {message}
        </div>
      </div>
    </div>
  );
}
