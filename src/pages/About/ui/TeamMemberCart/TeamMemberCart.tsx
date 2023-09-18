import { GithubOutlined } from '@ant-design/icons';
import { TeamMember } from 'pages/About/dataTeam';
import styles from './TeamMemberCart.module.css';

export const TeamMemberCart = ({ member }: { member: TeamMember }) => {
  const { name, avatar, nickname, githubLink, role, description } = member;

  // const classCard = id % 2 === 0 ? `${styles.teamCard} ${styles.teamInverted}` : styles.teamCard;

  return (
    <li className={styles.teamCard}>
      <a className={styles.teamImage} href={githubLink} target="_blank" rel="noreferrer">
        <img className={styles.imgFluid} src={avatar} alt="avatar" />
      </a>
      <div className={styles.teamPanel}>
        <div className={styles.teamHeading}>
          <p className={styles.fullName}>{name}</p>
          {role && (
            <p className={styles.subheading}>
              Role: <span className={styles.roles}>{role}</span>
            </p>
          )}
          {nickname && (
            <p className={styles.subheading}>
              GitHub:{' '}
              <a className={styles.github} href={githubLink} target="_blank" rel="noreferrer">
                {nickname} <GithubOutlined />
              </a>
            </p>
          )}
        </div>
        <div className={styles.teamBody}>
          <p className={styles.textMuted}>{description}</p>
        </div>
      </div>
    </li>
  );
};
