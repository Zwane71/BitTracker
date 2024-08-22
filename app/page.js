import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<div className=' text-white'> Crypto- Tracker</div>
			</div>

			<div className={styles.center}>
				<Link href={"/products"}>
					<button className={styles.neonButton}>Get Started</button>
				</Link>
			</div>

			<div className={styles.grid}></div>
		</main>
	);
}
