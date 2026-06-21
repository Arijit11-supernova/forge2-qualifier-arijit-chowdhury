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
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
            <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto border-b border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <MoveRight className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Kanban <span className="text-indigo-500">API</span></h1>
                        <p className="text-slate-500 text-sm">Precision task tracking for agile teams</p>
                    </div>
                </div>
                <button onClick={createBoard} className="group bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-sm">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span>New Board</span>
                </button>
            </header>

            <nav className="flex gap-3 mb-10 max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
                {boards.map(b => (
                    <button 
                        key={b.id} 
                        onClick={() => setActiveBoardId(b.id)} 
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeBoardId === b.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                    >
                        {b.name}
                    </button>
                ))}
            </nav>

            <div className="flex gap-6 items-start overflow-x-auto max-w-7xl mx-auto pb-12 snap-x">
                {lists.filter(l => l.board_id === activeBoardId).map(list => (
                    <div key={list.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl w-80 flex-shrink-0 snap-start shadow-sm">
                        <div className="flex justify-between items-center mb-5 px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider opacity-90">{list.name}</h3>
                                <span className="bg-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {cards.filter(c => c.list_id === list.id).length}
                                </span>
                            </div>
                            <button onClick={() => createCard(list.id)} className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-all">
                                <Plus size={18} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {cards.filter(c => c.list_id === list.id).map(card => (
                                <div key={card.id} className="bg-[#1e293b] p-4 rounded-xl shadow-sm border border-slate-700/50 hover:border-indigo-500/50 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-semibold text-slate-100 text-sm leading-relaxed">{card.title}</span>
                                        <button 
                                            onClick={() => moveCard(card.id, lists.find(l => l.id !== list.id && l.board_id === activeBoardId)?.id)} 
                                            className="p-1 bg-slate-800 text-slate-500 rounded-md hover:bg-indigo-600 hover:text-white transition-colors" 
                                            title="Move Card"
                                        >
                                            <MoveRight size={12} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {card.tags?.map(t => (
                                            <span key={t.id} className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight text-white shadow-sm" style={{ backgroundColor: t.color }}>{t.name}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                                        <div className="flex flex-col gap-1.5">
                                            {card.due_date && (
                                                <div className={`flex items-center gap-1.5 text-[11px] ${card.is_overdue ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                                                    <Calendar size={12} /> {card.due_date.split('T')[0]}
                                                    {card.is_overdue && <AlertCircle size={12} />}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                <User size={12} /> {card.members?.length ? card.members.map(m => m.name).join(', ') : 'Unassigned'}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-1">
                                            <button onClick={() => addTagToCard(card.id)} className="p-1.5 bg-slate-800 text-slate-400 rounded-md hover:bg-indigo-600 hover:text-white transition-all" title="Add Tag">
                                                <TagIcon size={14} />
                                            </button>
                                            <button onClick={() => assignMemberToCard(card.id)} className="p-1.5 bg-slate-800 text-slate-400 rounded-md hover:bg-indigo-600 hover:text-white transition-all" title="Assign Member">
                                                <User size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <button onClick={createList} className="bg-slate-800/20 border-2 border-dashed border-slate-700/50 p-6 rounded-2xl w-80 h-fit flex flex-col items-center justify-center text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all group">
                    <div className="p-2 bg-slate-800 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Plus size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Add List</span>
                </button>
            </div>
        </div>
    );
};

export default App;
