const Footer = ({ numItems = 0, numCompleted = 0, percentage = 0 }) => {
  return (
    <div className="footerWrapper">
      <p>
        {percentage === 100
          ? "✅ All Tasks Done!!"
          : `📌 Total Tasks: ${numItems} | ✅ Completed: ${numCompleted} | 📊 Percentage: ${percentage}%`}
      </p>
    </div>
  );
};

export default Footer;
