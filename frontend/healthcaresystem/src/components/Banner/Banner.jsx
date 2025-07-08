import styles from './styles.module.scss'
import bannerImage from '../../assets/imgs/banner.png';

function Banner() {
     return (
          <img src={bannerImage} alt="" className={styles.img} />
     );
}

export default Banner;