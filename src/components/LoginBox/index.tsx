import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/Auth';

// styles
import styles from './styles.module.scss';

export function LoginBox() {

    const { signInURl, user } = useContext(AuthContext);

    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInURl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com github
            </a>
        </div>
    );
}