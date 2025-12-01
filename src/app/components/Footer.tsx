import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="app-footer">
      <div className="footer-content">
        <p className="footer-text">From MangaReader With Love</p>
        <p className="footer-copyright">© {currentYear}</p>
      </div>
    </AntFooter>
  );
}

export default Footer;
