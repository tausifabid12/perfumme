// import CartierExperience from "@/components/CartierExperience";
// import ScrollProgress from "@/components/ScrollProgress";

// export default function Page() {
//     return (
//         <main className="bg-black">
//             <ScrollProgress />

//             <section className="h-screen flex items-center justify-center text-white text-6xl">
//                 Scroll Down
//             </section>

//             <CartierExperience />

//             <section className="h-screen flex items-center justify-center text-white text-6xl">
//                 End
//             </section>
//         </main>
//     );
// }



import GodModeScene from "@/components/GodModeScene";
import GodModeExperience from "@/components/GodModeExperience";
import ScrollVelocity from "@/components/providers/ScrollVelocity";


export default function Page() {
    return (
        <main className="bg-black">
            <ScrollVelocity />

            {/* 🌌 WebGL WORLD */}
            <GodModeScene />

            {/* 🎬 CINEMATIC VIDEO ENGINE */}
            <GodModeExperience />
        </main>
    );
}