import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';

function Home() {
    const [herois, getHerois] = useState([]);
    const [filtro, setFiltro] = useState([]);
    const [id, setId] = useState();
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
                getHerois(response.data);
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

    function filtrar(e) {
        if (e == null) {
            e = parseInt(id);
        }
        // Verifica se o id já está no filtro para evitar duplicatas
        if (filtro.some(item => item.id === e)) {
            return; // Se já estiver no filtro, não faz nada
        }

        // Adiciona o novo filtro ao estado existente

        const novoFiltro = herois.filter(x => x.id === e);
        setFiltro(prevFiltro => [...prevFiltro, ...novoFiltro]);
        maior(novoFiltro);

    }

    function maior(e) {
        console.log(e)
        console.log(e.powerstats)
        /*const aux = Object.values(e.powerstats)
        const aux2 = aux.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0)
        if (poder.power < aux2) {
            setPoder(e.id, aux2);
        }*/

    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center py-20 px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full '> {/* Contêiner de grade para as colunas */}
                <div className='flex flex-col items-center justify-center'> {/* Coluna 1 */}
                    <h2 className="text-2xl mb-6">Lutadores</h2>
                    <div className="w-full max-w-full h-[600px] overflow-y-auto border-2 border-[#a82222]">
                        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 '>
                            {herois.length === 0 && (
                                <h3 className="text-center my-20 text-xl col-span-full">Não há Lutadores</h3>
                            )}
                            {herois.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => filtrar(item.id)} // Passa a função corretamente para o onClick
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

                            <h2 className="text-xl font-semibold">O Ganhador é ....{poder.id}</h2>
                            <p className="mt-4">aqui iria a imagem do Ganhador</p>
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
                            <h3>Id do Lutador</h3>
                            <input
                                type="number"
                                className="h-8 px-2 mr-2 bg-[#e7e7e7]"
                                placeholder="14"
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>

                        <div>
                            <button type="button"
                                onClick={() => filtrar(null)}
                                className="bg-[#2c6825] text-white w-1/5 m-auto rounded-xl h-8 duration-100 hover:bg-[#398830] font-bold px-2"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Se você deseja mostrar os resultados do filtro, adicione esta seção abaixo */}
            {filtro.length > 0 && (
                <div className="w-full max-w-full h-[600px] overflow-y-auto border-2 border-[#a82222] mt-8">
                    <h2 className="text-2xl mb-6 text-center">Lutadores Filtrados</h2>
                    <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                        {filtro.map((item) => (
                            <li key={item.id} className="p-3 m-3 border-solid border-2 rounded-md border-[#a82222] flex flex-col items-center">
                                <span>Id: {item.id}<br /> Nome: {item.name}<br /></span>
                                <img src={item.images.lg} alt={item.name} className="max-w-full h-auto mt-2" />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Home;