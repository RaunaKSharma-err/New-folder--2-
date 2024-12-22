import React from 'react'

const Footer = () => {
  return (
    <>
     <footer className="bg-blue-600 text-white py-4 fixed bottom-0 right-0 left-0 ">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p>&copy; 2024 Football Management. All rights reserved.</p>
          <div className="space-x-4 mt-4">
            <a href="/privacy" className="hover:text-blue-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer