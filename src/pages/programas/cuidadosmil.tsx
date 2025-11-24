import { Header } from "@/components/Header";
import cardiologiaImg from "@/assets/cardiologia.png";
import hematologiaImg from "@/assets/hematologia.png";
import endocrinologiaImg from "@/assets/endocrinologia.png";
import pulmonarImg from "@/assets/pulmonar.png";
import oncologiaImg from "@/assets/oncologia.png";
import ortopediaImg from "@/assets/ortopedia.png";
import saudeMentalImg from "@/assets/saudemental.png";
import obstetriciaImg from "@/assets/obstetricia.png";
import nefrologiaImg from "@/assets/nefrologia.png";
import clinicaMedicaImg from "@/assets/clinica_medica2.png";
import cuidadosmilLogo from "@/assets/logo cuidadosmil-v2.png";
import bannerImg from "@/assets/bannerPaginaProgrmas.webp";

interface CareProgram {
  name: string;
}

interface CareLine {
  specialty: string;
  image: string;
  programs: CareProgram[];
}

const CARE_LINES: CareLine[] = [
  {
    specialty: "Cardiologia",
    image: cardiologiaImg,
    programs: [
      { name: "Insuficiência Cardíaca Controlada" },
      { name: "Cuidados Pós-infarto" },
    ],
  },
  {
    specialty: "Hematologia",
    image: hematologiaImg,
    programs: [{ name: "Anticoagulante Seguro" }],
  },
  {
    specialty: "Endocrinologia",
    image: endocrinologiaImg,
    programs: [{ name: "Emagrecimento" }],
  },
  {
    specialty: "Pulmonar",
    image: pulmonarImg,
    programs: [{ name: "Fumo Zero" }],
  },
  {
    specialty: "Oncologia",
    image: oncologiaImg,
    programs: [{ name: "Cuidado Integral da Mama" }],
  },
  {
    specialty: "Ortopedia",
    image: ortopediaImg,
    programs: [{ name: "Saúde da Coluna" }],
  },
  {
    specialty: "Saúde Mental",
    image: saudeMentalImg,
    programs: [{ name: "Saúde Mental" }],
  },
  {
    specialty: "Obstetrícia",
    image: obstetriciaImg,
    programs: [{ name: "Gestação Segura" }],
  },
  {
    specialty: "Nefrologia",
    image: nefrologiaImg,
    programs: [{ name: "Saúde Renal" }],
  },
  {
    specialty: "Clínica Médica e Geriatria",
    image: clinicaMedicaImg,
    programs: [{ name: "Melhores Cuidados" }, { name: "Viva Bem" }],
  },
];

export default function Cuidadosmil() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full">
        <img
          src={bannerImg}
          alt="Banner Programas de Saúde e Linhas de Cuidado Amil"
          className="w-full h-auto object-cover"
        />
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-left">
              <div className="mb-6 flex justify-start">
                <img
                  src={cuidadosmilLogo}
                  alt="cuidadosmil"
                  className="h-20 md:h-28 w-auto"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#003B71] mb-4">
                Programas de Saúde e Linhas de Cuidado Amil
              </h2>
              <p className="text-base md:text-lg text-gray-700 max-w-4xl leading-relaxed">
                Com o objetivo de acompanhar mais de perto a sua saúde e propor
                um modelo integrado de atenção, os Programas de Saúde e Linhas
                de Cuidado Amil oferecem cuidados em diferentes especialidades -
                mantendo foco em prevenção, acompanhamento e tratamento. Os
                nossos programas, além disso, têm o propósito de evitar doenças
                e monitorar aqueles que já possuem enfermidades, reduzindo os
                riscos à saúde e promovendo melhorias na qualidade de vida dos
                nossos beneficiários.
              </p>
            </div>

            <div className="mb-12 p-6 md:p-8 bg-[#F8F9FA] rounded-xl border border-gray-200">
              <p className="text-base md:text-lg text-gray-700">
                <span className="font-bold text-[#003B71]">
                  Gostaria de agendar sua primeira consulta?{" "}
                </span>
                Ligue para:{" "}
                <a
                  href="tel:+551130041080"
                  className="font-bold text-gray-700 hover:underline"
                >
                  11 3004-1080
                </a>{" "}
                ou se preferir{" "}
                <a
                  href="https://wa.me/551130041080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#461BFF] hover:underline font-semibold"
                >
                  acesse aqui
                </a>{" "}
                e utilize o WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              {CARE_LINES.map((line, index) => (
                <div key={index} className="w-full">
                  <img
                    src={line.image}
                    alt={line.specialty}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#F0F0F0] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#003B71] mb-2">
                Amil
              </h3>
              <div className="h-px bg-[#003B71] w-16 mb-6"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      Sobre
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contato"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Contato
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/contato"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Contato
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/privacidade"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Privacidade
                    </a>
                  </li>
                  <li>
                    <a
                      href="/termos"
                      className="text-[#003B71] hover:text-[#461BFF] transition-colors"
                    >
                      Termos de Uso
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-300 text-center">
              <p className="text-xs text-gray-600">
                © 2024 Amil. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
