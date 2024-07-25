import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

function Home() {
    const [herois, setHerois] = useState([]);
    const [originalHerois, setOriginalHerois] = useState([]); // Estado para armazenar os heróis originais
    const [select, setSelect] = useState([]);
    const [nome, setNome] = useState('');
    const [poder, setPoder] = useState({
        id: null,
        power: 0
    });
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        async function loadApi() {
            try {
                const response = await api.get();
                const data = response.data;
                setHerois(data);
                setOriginalHerois(data); // Armazena os heróis originais
            } catch (error) {
                if (error.response) {
                    alert("Heroi não encontrado");
                } else if (error.request) {
                    alert("Heroi não encontrado");
                }
            }
        }

        loadApi();
    }, []);

    function selecionar(e) {
        // Verifica se o id já está no select para evitar duplicatas
        if (select.some(item => item.id === e)) {
            return; // Se já estiver, não faz nada
        }

        // Adiciona o novo lutador ao estado existente
        const novoSelecionar = herois.filter(x => x.id === e);
        setSelect(prevSelect => [...prevSelect, ...novoSelecionar]);
        maior(novoSelecionar);
    }

    function filtrar() {
        const nomeLowerCase = nome.toLowerCase();
        const heroisFiltrados = originalHerois.filter(x => x.name.toLowerCase().includes(nomeLowerCase));
        setHerois(heroisFiltrados);

        // Recalcula o maior poder
        if (heroisFiltrados.length > 0) {
            maior(heroisFiltrados);
        }
    }

    function maior(heroisFiltrados) {
        if (heroisFiltrados.length === 0) return;

        const aux = Object.values(heroisFiltrados[0].powerstats);
        const aux2 = aux.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
        if (poder.power < aux2) {
            setPoder({ id: heroisFiltrados[0].id, power: aux2 });
        }
    }

    function limpar() {
        setSelect([]); // Limpa a lista definindo como array vazio
    }

    const vencedor = select.find(item => item.id === poder.id);

    return (
        <div className='flex flex-col items-center justify-center py-20 px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'> {/* Contêiner de grade para as colunas */}
                <div className='flex flex-col items-center justify-center'> {/* Coluna 1 */}
                    <h2 className="text-2xl mb-6">Lutadores</h2>
                    <div className="w-full max-w-full h-[600px] overflow-y-auto border-2 border-[#a82222]">
                        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                            {herois.length === 0 && (
                                <h3 className="text-center my-20 text-xl col-span-full">Não há Lutadores</h3>
                            )}
                            {herois.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => selecionar(item.id)}
                                    className="p-3 m-3 border-solid border-2 rounded-md border-[#a82222] duration-100 hover:bg-slate-400 flex flex-col items-center cursor-pointer"
                                >
                                    <span>Id: {item.id}<br /> Nome: {item.name}<br /></span>
                                    <img src={item.images.lg} alt={item.name} className="max-w-full h-auto mt-2" />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='pt-24'>
                        <button
                            onClick={openModal}
                            type="button"
                            className="bg-[#fffb29] text-black w-full md:w-auto rounded-xl h-8 duration-100 hover:bg-[#e6e22b] font-bold px-4"
                        >
                            Quem ganha
                        </button>
                        <Modal isOpen={isModalOpen} onClose={closeModal}>
                            {vencedor ? (
                                <>
                                    <h2 className="text-xl font-semibold">O Ganhador é ....{vencedor.name}</h2>
                                    <img src={vencedor.images.lg} className="max-w-full h-auto mt-2" />
                                </>
                            ) : (
                                <p className="text-xl font-semibold">Nenhum vencedor encontrado</p>
                            )}
                            <button
                                onClick={closeModal}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            >
                                Fechar
                            </button>
                        </Modal>
                    </div>
                </div>

                <div className='flex flex-col items-center justify-center'> {/* Coluna 2 */}
                    <div className="w-full text-center px-4">
                        <div className="my-4">
                            <h2>Nome do Lutador</h2>
                            <input
                                type="text"
                                className="h-8 px-2 mr-2 bg-[#e7e7e7]"
                                placeholder="Nome do Lutador"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div>
                            <button type="button"
                                onClick={filtrar}
                                className="bg-[#fffb29] text-black w-1/5 m-auto rounded-xl h-8 duration-100 hover:bg-[#e6e22b] font-bold px-2"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Se você deseja mostrar os resultados do filtro, adicione esta seção abaixo */}
            {select.length > 0 && (
                <div className="w-full max-w-full h-[600px] overflow-y-auto border-2 border-[#a82222] mt-8">
                    <h2 className="text-2xl mb-6 text-center">Lutadores Selecionados</h2>
                    <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                        {select.map((item) => (
                            <li key={item.id} className="p-3 m-3 border-solid border-2 rounded-md border-[#a82222] flex flex-col items-center">
                                <span>Id: {item.id}<br /> Nome: {item.name}<br /></span>
                                <img src={item.images.lg} alt={item.name} className="max-w-full h-auto mt-2" />
                            </li>
                        ))}
                    </ul>
                </div>  
            )}
            <button
                type="button"
                onClick={limpar}
                className="bg-[#fffb29] text-black w-1/5 m-auto rounded-xl h-8 duration-100 hover:bg-[#e6e22b] font-bold px-2 mt-4"
            >
                Limpar lista
            </button>
        </div>
    );
}

export default Home;