import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cuidadosmilCardImg from "@/assets/imagemCardCuidadosmil.webp";
import agendamentoOnlineImg from "@/assets/agendamentoOn-line.webp";
import boletoBeneficiarioImg from "@/assets/boleto-beneficiario.webp";
import boletoEmpresaImg from "@/assets/boleto-empresa.webp";
import validadorBoletoImg from "@/assets/validador-boleto.webp";
import precisaIrAoDentistaImg from "@/assets/precisoIrAoDentista.webp";
import atualizacaoRedeImg from "@/assets/atualizacaoRedeCredenciada.webp";
import contratosImg from "@/assets/Contratos.webp";
import relatorioESGImg from "@/assets/relatorioESG.webp";
import amilOneImg from "@/assets/amilOne.webp";

interface Service {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  link?: string;
}

const SERVICES_DATA: Service[] = [
  {
    title: "Agendamento on-line",
    description: "Agende consultas e exames de forma rápida e prática.",
    buttonText: "Acesse aqui",
    imageUrl: agendamentoOnlineImg,
  },
  {
    title: "Boleto - Beneficiário",
    description:
      "Em casos de perda ou de não recebimento do boleto, é possível obter a segunda via.",
    buttonText: "Obtenha aqui",
    imageUrl: boletoBeneficiarioImg,
  },
  {
    title: "Boleto - Empresa",
    description:
      "Em casos de perda ou de não recebimento do boleto, é possível obter a segunda via.",
    buttonText: "Obtenha aqui",
    imageUrl: boletoEmpresaImg,
  },
  {
    title: "Validador de boleto",
    description:
      "Utilize a nossa funcionalidade e verifique se o boleto ou se o código Pix recebido é legítimo.",
    buttonText: "Valide aqui",
    imageUrl: validadorBoletoImg,
  },
  {
    title: "Precisa ir ao dentista?",
    description:
      "Conheça as especialidades odontológicas e tenha o melhor cuidado bucal.",
    buttonText: "Acesse aqui",
    imageUrl: precisaIrAoDentistaImg,
  },
  {
    title: "Atualizações da rede credenciada",
    description:
      "Consulte as atualizações da rede credenciada e fique atento às mudanças.",
    buttonText: "Consulte aqui",
    imageUrl: atualizacaoRedeImg,
  },
  {
    title: "Contratos",
    description:
      "Tudo que você ou a sua empresa precisa saber sobre informações contratuais.",
    buttonText: "Confira aqui",
    imageUrl: contratosImg,
  },
  {
    title: "Relatório ESG",
    description:
      "Confira o Relatório de Responsabilidade Social do Grupo Amil.",
    buttonText: "Acesse aqui",
    imageUrl: relatorioESGImg,
  },
  {
    title: "Cuidadosmil",
    description: "Conheça os Programas de Saúde e as Linhas de Cuidado Amil.",
    buttonText: "Saiba mais",
    imageUrl: cuidadosmilCardImg,
    link: "/programas/cuidadosmil",
  },
  {
    title: "Amil One",
    description:
      "Conheça os nossos planos Premium e tenha o cuidado exclusivo que você merece.",
    buttonText: "Conheça aqui",
    imageUrl: amilOneImg,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#003B71] mb-12 text-left">
          Serviços Amil
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service, index) => (
            <Card
              key={index}
              className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow h-full flex flex-col overflow-hidden"
            >
              <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-[#003B71] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-1">
                  {service.description}
                </p>
                {service.link ? (
                  <Link to={service.link} className="mt-auto">
                    <Button className="w-full bg-[#461BFF] hover:brightness-90 text-white rounded-md">
                      {service.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full bg-[#461BFF] hover:brightness-90 text-white rounded-md mt-auto"
                    onClick={(e) => e.preventDefault()}
                  >
                    {service.buttonText}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
