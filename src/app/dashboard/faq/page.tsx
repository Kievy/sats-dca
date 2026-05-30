import { CircleHelp } from "lucide-react";
import { PageTitle } from "@/frontend/components/page-title";
import { Panel } from "@/frontend/components/panel";

const items = [
  {
    question: "O que e DCA em Bitcoin?",
    answer:
      "DCA e comprar Bitcoin em aportes recorrentes, sem tentar acertar o melhor momento do mercado. O dashboard ajuda a acompanhar como essas compras evoluem ao longo do tempo.",
  },
  {
    question: "Como o preco medio e calculado?",
    answer:
      "O preco medio considera o preco do Bitcoin em cada compra e a quantidade de sats adquirida. Assim compras maiores pesam mais no resultado final.",
  },
  {
    question: "O que significa BTC acumulado em sats?",
    answer:
      "Sats sao as menores unidades do Bitcoin. O BTC acumulado mostra quantos satoshis voce juntou com todos os seus aportes.",
  },
  {
    question: "Por que o lucro ou prejuizo muda?",
    answer:
      "Esse valor compara o total investido com o valor atual aproximado do seu BTC acumulado, usando a cotacao mais recente disponivel.",
  },
  {
    question: "Para que servem plataformas e metas?",
    answer:
      "Plataformas ajudam a separar onde cada compra foi feita. Metas ajudam a organizar aportes por objetivo, como reserva, longo prazo ou estudo.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageTitle icon={CircleHelp} title="FAQ" />
      <div className="grid gap-4">
        {items.map((item) => (
          <Panel key={item.question} title={item.question}>
            <p className="text-muted">{item.answer}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
