import React, { useState, useEffect } from 'react';
import { ListService, CardService, BoardService, TagService, MemberService } from './services/api';
import { Plus, Calendar, User, Tag as TagIcon, AlertCircle, MoveRight } from 'lucide-react';

const App = () => {
    const [boards, setBoards] = useState([]);
    const [lists, setLists] = useState([]);
    const [cards, setCards] = useState([]);
    const [tags, setTags] = useState([]);
    const [members, setMembers] = useState([]);
    const [activeBoardId, setActiveBoardId] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [b, l, c, t, m] = await Promise.all([
                BoardService.getAll(),
                ListService.getAll(),
                CardService.getAll(),
                TagService.getAll(),
                MemberService.getAll()
            ]);
            setBoards(b.data);
            setLists(l.data);
            setCards(c.data);
            setTags(t.data);
            setMembers(m.data);
            if (b.data.length > 0) setActiveBoardId(b.data[0].id);
        } catch (e) { console.error("Error loading data", e); }
    };

    const createBoard = async () => {
        const name = prompt("Board Name:");
        if (name) {
            const res = await BoardService.create({ name });
            setBoards([...boards, res.data]);
            setActiveBoardId(res.data.id);
        }
    };

    const createList = async () => {
        const name = prompt("List Name:");
        if (name && activeBoardId) {
            const res = await ListService.create({ name, board_id: activeBoardId });
            setLists([...lists, res.data]);
        }
    };

    const createCard = async (listId) => {
        const title = prompt("Card Title:");
        if (title) {
            const dueDate = prompt("Due Date (YYYY-MM-DD):", "");
            const res = await CardService.create({ title, list_id: listId, due_date: dueDate || null });
            setCards([...cards, res.data]);
        }
    };

    const moveCard = async (cardId, newListId) => {
        try {
            await CardService.move(cardId, { list_id: newListId });
            const updated = [...cards];
            const card = updated.find(c => c.id === cardId);
            if (card) card.list_id = newListId;
            setCards(updated);
        } catch (e) { console.error("Error moving card", e); }
    };

    const addTagToCard = async (cardId) => {
        const tagId = prompt("Tag ID to add:");
        if (tagId) {
            await CardService.attachTag(cardId, { tag_id: tagId });
            loadInitialData();
        }
    };

    const assignMemberToCard = async (cardId) => {
        const memberId = prompt("Member ID to assign:");
        if (memberId) {
            await CardService.assignMember(cardId, { member_id: memberId });
            loadInitialData();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
            <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Kanban Workspace</h1>
                    <p className="text-slate-400">Manage your project tasks and team flow</p>
                </div>
                <button onClick={createBoard} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                    <Plus size={20} /> Create Board
                </button>
            </header>

            <div className="flex gap-3 mb-10 max-w-7xl mx-auto overflow-x-auto pb-2">
                {boards.map(b => (
                    <button 
                        key={b.id} 
                        onClick={() => setActiveBoardId(b.id)} 
                        className={`px-5 py-2 rounded-full font-medium transition-all ${activeBoardId === b.id ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 ring-offset-2 ring-offset-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {b.name}
                    </button>
                ))}
            </div>

            <div className="flex gap-8 items-start overflow-x-auto max-w-7xl mx-auto pb-12">
                {lists.filter(l => l.board_id === activeBoardId).map(list => (
                    <div key={list.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl w-80 flex-shrink-0 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-200 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                {list.name}
                            </h3>
                            <button onClick={() => createCard(list.id)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition">
                                <Plus size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {cards.filter(c => c.list_id === list.id).map(card => (
                                <div key={card.id} className="bg-slate-700 p-5 rounded-lg shadow-sm border-l-4 border-indigo-500 hover:bg-slate-600 transition-colors group relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-semibold text-slate-100 text-lg leading-tight">{card.title}</span>
                                        <button 
                                            onClick={() => moveCard(card.id, lists.find(l => l.id !== list.id && l.board_id === activeBoardId)?.id)} 
                                            className="p-1.5 bg-slate-600 text-slate-300 rounded hover:bg-indigo-500 hover:text-white transition-all" 
                                            title="Move Card"
                                        >
                                            <MoveRight size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {card.tags?.map(t => (
                                            <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white" style={{ backgroundColor: t.color }}>{t.name}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-600">
                                        <div className="flex flex-col gap-2">
                                            {card.due_date && (
                                                <div className={`flex items-center gap-1.5 text-xs ${card.is_overdue ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                                                    <Calendar size={14} /> {card.due_date.split('T')[0]}
                                                    {card.is_overdue && <AlertCircle size={14} />}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <User size={14} /> {card.members?.length ? card.members.map(m => m.name).join(', ') : 'Unassigned'}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button onClick={() => addTagToCard(card.id)} className="p-2 bg-slate-600 rounded-lg text-slate-300 hover:bg-indigo-500 hover:text-white transition-all" title="Add Tag">
                                                <TagIcon size={16} />
                                            </button>
                                            <button onClick={() => assignMemberToCard(card.id)} className="p-2 bg-slate-600 rounded-lg text-slate-300 hover:bg-indigo-500 hover:text-white transition-all" title="Assign Member">
                                                <User size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <button onClick={createList} className="bg-slate-800/30 border-2 border-dashed border-slate-700 p-6 rounded-xl w-80 h-fit flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all group">
                    <div className="p-2 bg-slate-800 rounded-full mb-2 group-hover:bg-slate-700 transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Add New List</span>
                </button>
            </div>
        </div>
    );
};

export default App;
