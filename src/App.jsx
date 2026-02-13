import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

// ─── Constants ───────────────────────────────────────────────────────────────
const BRAND = { primary: "#7c6bc4", dark: "#5b4a9e", light: "#9d8fd6", faint: "rgba(124,107,196,0.1)", border: "rgba(124,107,196,0.25)" };
const LOGO_W = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACGCAYAAACYCsWCAAAD6UlEQVR42u3dQZLbIBBAUUH5/ldWNpMqx7HHki2gG97fJmOg6S9AQmjbAAAAAAAAAAAAAAAAAAAAAAAAkInSq6B93/elAltKWT25rurzZ7Fs+dv33MgRI4FmE2qWPq8CNWb0eIzLTHGaqS1VoMbLYaRdUBByrBmX2dpXBSnWojxz7Gbs9ypI/eQ4GpuMMZy136sgxZIjYyxn7vcqSPHkyBTT2fu9ClJMOTLEdoV+L4IUV44WNwGiCnJl+87U6125hRzx5YgoyRXt69We3+r6rg6VHDnkiBTzlW4gFHLkkCPKSNKyfd+265O6XT7FIkeM2IyQZFTfv2prj2leJUc+OVYoLwq3kQGaZYv3qOTZ933vEcOVN1HWDamTp3X5q+8wJghJQRCSZBSv/DByik4QpB6VWktCkIk6+qqktpOYICRpnHCz3KEkCEnIQRCSZJtWHY2BNQhJUq0lZns3nyCTcyTRok6t3tVr/4EgRpFmiRZ93TH6DDGCLCxJhkX5q9/udSOAIItKklmO+3+3SMflkkSX42zit5SEIAtKEl2OSPW5Sbt8kkTYRJjht66IkxHESJJ2FLNIR6hEXfGrWQQhCTkIQpKoZUTfWm+RbuE+XMC/dY+4/8wIYiQZUtdnzzpanZzzTWwIQhLrDlMs062ocvSS+tO4GEHQVY5soxJBJLhpFUHWlORsspPDGsRoAiMIQBCAIIA1iDk+CAJs2/8f/fnmC7RX/L0pFlLL9NuxP0fOzSIIUgsQvSxTLBAj6gji02FzJ/wMNzAOjyCtXsohSX6yinCk3nWFQGBckvU4/bCl1HWVqwXGjhxR8uassLV1YECOKHnzSfm1Z2Gw5hiVN5+WW0cFCusuyHvnzdBDG0hCjsh58205NVNjMYccvfIm1F4skpDj099ucbLJVb9ZM10RMJccLcq5ur41a0AxjxxXldeivnWGwGKePoz2hak6W4CRv+8iHVdUWzeUKORoWY/md8J6NdiuXXIAAAAAAAAAANCZU/e9PcvAdAK8efbjZEWAIAAAAAAAAAAAYEG6vkF2/yT+1RPMI/+nVZ3+CUzHt+se6zCq7NF9cmanRq8YDXtQ+CwYtrKMRZ8EEgTIgI94IvYaYPBBEkYQkCOjICMX6ObecRN2akEiB3jVM6GchRV4BHGVjoc+CTrFitAxrqZkecRdLKQTtOeFrAq+KyiSCWKqo0+WnWKVUoorc7zkj9onHhTqBATul+GCGE1yrs9MsRbqEAkhJmmmWKO3mEgUWIPAGi2yINECXh4gAUKtQSTGsWndakn82/R2+lduAVOsZFelV1cnC3UAAAAAAAAAAAAAAIBt27Y//Sx1sQXGEZMAAAAASUVORK5CYII=";
const LOGO_D = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACGCAYAAACYCsWCAAADfUlEQVR42u3dQW7jMAxA0VLo/a/M2XaKAaZJLYmU3ge6ChrJFL9FOk788QEAAAAAAAAAAAAAAAAAAAAAAIBOxMKxUmyvIyfGMles0yc5yiRQkKMeQ6C27R55cJyOOZYhUCXksNNeKAg57oxLEkQSzGzKkxxnC0KO38cmyXGmIOR4LjZJjrMEIcfzsUlynCEIOebFJsnRu7Ekx5rYxOGCxKZ5xcxJkWNtbOIwOaLAXGNWiUWO9bHJg+RoMdcgRxs5quwkWfi48ukxgxzt5NgpSRaL//Qyb5CjpRw3jFeCz80BOuUW79w4bpBjHuMD3ZMnyUEQSGKCoJwku8WL/5SQQRDYlTb2sQQ5a6HzMjmmz5UgJJmVcEdcoSQISchBEJI0LKuigowEIUnVprmEsAQ5n1yYjLF47qlJt4vMTrTqfcfW3xAjyN2SdGjKY+eFAILcK0lnOb6+rknH45JUl+PVxA+CYFlZUUCOMvP5lHMtJcmD5Jj5Xr+Okx3ETtJ5F9Oko1SiXvfULIKQhBwEIUnhMUrfWq9J17hXEDAfHOvRONhB7CS75vqvzzpy4lgEweOSXP8oayWWcmu3HKukfisudhCslqPVrkQQCa6sIsi1kgQ59CCQ9HYQgCAAQQA9iBofBAHe4PtDf95+Au1D/6/EQmuZ8o3XfiIPQdBCgNJjKbFAjMI7iEeHnZ3w7S9gvLKDzPpSDkn6E6fOe1wSCOxLsiiaNz+a05j1xiBH0bx5SdixIDAgR5W8eXn8sThA0HNEpzmPjYHCvQ15dJnzaHiw6C3H6rz51Tij2cHiDDlW5U2pe7FIQo533zuqvudodkbAWXLMGOfR+Y7GAcU5cjw13uPzHYcEFuesYaknTI0DA4z+a1fm54rGggMlCjlmziNOCYa7dskBAAAAAAAAAMBKXr3u7bMMXOWAX1YECAIAAAAAAAAAAC5k9TfI8gdj5+L5VXj4SxYZe/eaZLXc3flBYf4yQLAmRwsClMdDPKENsIOAHOcJsrNB1w8VTdjTBQmL77gJ8swZHNbkekGqLYyzKVn+wlUsdBR02YlsCL4zKPoJotSxJteWWOHMXDL5k5hKLGdH69JOELtJz/5MiXXRgkgIMWlTYkWxxZcoBAH0aJUEiYIJ8PWPBCjVg0iMn5V1tyVx7l43JRZAkJeb7tCoAwAAAAAAAAAAAAAAfOcP1MSeA0oDJCYAAAAASUVORK5CYII=";
const STATUSES = [
  { key: "open", label: "Open", color: BRAND.primary, bg: BRAND.faint },
  { key: "in_progress", label: "In Progress", color: "#c4a76b", bg: "rgba(196,167,107,0.12)" },
  { key: "on_hold", label: "On Hold", color: "#8a8a8a", bg: "rgba(138,138,138,0.12)" },
  { key: "complete", label: "Complete", color: "#6bc4a0", bg: "rgba(107,196,160,0.12)" },
];
const LIST_TYPES = {
  tasks: { label: "Tasks" }, quotes: { label: "Quotes" },
  sales_orders: { label: "Sales Orders" }, po_wo: { label: "PO / Work Orders" },
};
const LIST_ICONS = { tasks: "check", quotes: "list", sales_orders: "box", po_wo: "wrench" };
const DEFAULT_LISTS = [
  { type: "quotes", name: "My Quotes" }, { type: "tasks", name: "My Tasks" },
  { type: "sales_orders", name: "My SOs" }, { type: "po_wo", name: "My POs" },
];
const fmtDate = (d) => { if (!d) return ""; try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); } catch { return d; } };
const fmtDateTime = (d) => { if (!d) return ""; try { return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch { return d; } };
const F = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const br = { border: "none", outline: "none", background: "none", fontFamily: F };
const themes = {
  dark: { bg: "#111114", text: "#eaeaed", muted: "#75757e", card: "#1c1c20", cardHover: "#222226", border: "#2a2a30", headerBg: "rgba(17,17,20,0.92)", inputBg: "#161618", overlay: "rgba(0,0,0,0.65)" },
  light: { bg: "#f6f5f3", text: "#1a1a1e", muted: "#8e8e96", card: "#ffffff", cardHover: "#faf9f8", border: "#e4e3e0", headerBg: "rgba(246,245,243,0.92)", inputBg: "#fff", overlay: "rgba(0,0,0,0.35)" },
};

const Icon = ({ name, size = 18, color = BRAND.primary }) => {
  const p = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
    bolt: "M13 10V3L4 14h7v7l9-11h-7z",
    chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    sun: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    moon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
    plus: "M12 4v16m8-8H4", x: "M6 18L18 6M6 6l12 12",
    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    chevDown: "M19 9l-7 7-7-7", chevRight: "M9 5l7 7-7 7",
    alert: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    list: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    box: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    wrench: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
    check: "M5 13l4 4L19 7",
    refresh: "M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0113.292-4.293M20 15a8 8 0 01-13.292 4.293",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={p[name]} /></svg>;
};

// ─── Supabase Data Layer ─────────────────────────────────────────────────────
const db = {
  async getUsers() { const { data } = await supabase.from("app_users").select("*").order("created_at"); return data || []; },
  async getLists() { const { data } = await supabase.from("lists").select("*").order("created_at"); return data || []; },
  async getTasks() { const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false }); return data || []; },
  async getAudit(taskId) { const { data } = await supabase.from("audit_log").select("*").eq("task_id", taskId).order("created_at"); return data || []; },

  async addTask(task) { const { data } = await supabase.from("tasks").insert(task).select().single(); return data; },
  async updateTask(id, updates) { const { data } = await supabase.from("tasks").update(updates).eq("id", id).select().single(); return data; },
  async deleteTask(id) { await supabase.from("tasks").delete().eq("id", id); },

  async addList(list) { const { data } = await supabase.from("lists").insert(list).select().single(); return data; },
  async deleteList(id) { await supabase.from("tasks").delete().eq("list_id", id); await supabase.from("lists").delete().eq("id", id); },

  async addUser(user) { const { data } = await supabase.from("app_users").insert(user).select().single(); return data; },
  async updateUser(id, updates) { const { data } = await supabase.from("app_users").update(updates).eq("id", id).select().single(); return data; },
  async deleteUser(id) {
    await supabase.from("tasks").delete().eq("user_id", id);
    await supabase.from("lists").delete().eq("user_id", id);
    await supabase.from("app_users").delete().eq("id", id);
  },

  async addAudit(entry) { await supabase.from("audit_log").insert(entry); },
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function CMITracker() {
  const [theme, setTheme] = useState(() => localStorage.getItem("cmi-theme") || "dark");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selIds, setSelIds] = useState([]);
  const [detailTask, setDetailTask] = useState(null);
  const [detailAudit, setDetailAudit] = useState([]);
  const [showDone, setShowDone] = useState({});
  const [qaOpen, setQaOpen] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(false);
  const [collapsedUsers, setCollapsedUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [u, l, t] = await Promise.all([db.getUsers(), db.getLists(), db.getTasks()]);
    setUsers(u); setLists(l); setTasks(t);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);
  useEffect(() => { localStorage.setItem("cmi-theme", theme); }, [theme]);

  // Poll for updates every 15 seconds so team sees each other's changes
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(loadAll, 15000);
    return () => clearInterval(interval);
  }, [currentUser, loadAll]);

  if (loading) {
    const t = themes[theme];
    return <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ textAlign: "center", color: t.muted }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.dark})`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><img src={LOGO_W} alt="CMI" style={{ width: "80%", objectFit: "contain" }} /></div>
        <div style={{ fontSize: 15 }}>Loading...</div>
      </div>
    </div>;
  }

  if (!currentUser) return <Login users={users} onLogin={u => { setCurrentUser(u); setSelIds([]); }} theme={theme} setTheme={setTheme} />;

  const isA = currentUser.isAdmin;
  const eUid = currentUser.id;
  const uLists = lists.filter(l => l.user_id === eUid);
  const aLists = selIds.length > 0 ? lists.filter(l => selIds.includes(l.id)) : [];
  const gTasks = (lid) => tasks.filter(t => t.list_id === lid);
  const gActive = (lid) => tasks.filter(t => t.list_id === lid && t.status !== "complete").length;
  const isHome = !activeOpen && !metricsOpen && selIds.length === 0;
  const t = themes[theme];

  const addTask = async (lid, d) => {
    const list = lists.find(l => l.id === lid);
    const task = await db.addTask({
      list_id: lid, user_id: list?.user_id || eUid, status: "open", starred: false,
      customer: d.customer || "", reference: d.reference || "", amount: d.amount || "",
      date_received: d.dateReceived || new Date().toISOString().split("T")[0],
      due_date: d.dueDate || null, title: d.title || "", notes: d.notes || "",
    });
    if (task) {
      await db.addAudit({ task_id: task.id, user_id: currentUser.id, action: "created", detail: "Task created" });
      setTasks(prev => [task, ...prev]);
    }
    setQaOpen(null);
  };

  const updTask = async (id, updates) => {
    // Map camelCase to snake_case for DB
    const dbUpdates = {};
    const keyMap = { customer: "customer", reference: "reference", amount: "amount", dateReceived: "date_received", dueDate: "due_date", title: "title", notes: "notes", status: "status", starred: "starred" };
    for (const [k, v] of Object.entries(updates)) dbUpdates[keyMap[k] || k] = v;
    const updated = await db.updateTask(id, dbUpdates);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      await db.addAudit({ task_id: id, user_id: currentUser.id, action: "updated", detail: Object.entries(updates).map(([k, v]) => `${k}: ${v}`).join(", ") });
    }
    return updated;
  };

  const chgStatus = async (tid, ns) => {
    const tk = tasks.find(t => t.id === tid);
    const updated = await db.updateTask(tid, { status: ns });
    if (updated) {
      setTasks(prev => prev.map(t => t.id === tid ? updated : t));
      await db.addAudit({ task_id: tid, user_id: currentUser.id, action: "status_change", detail: `${tk?.status} → ${ns}` });
    }
  };

  const togStar = async (tid) => {
    const tk = tasks.find(t => t.id === tid);
    const updated = await db.updateTask(tid, { starred: !tk.starred });
    if (updated) setTasks(prev => prev.map(t => t.id === tid ? updated : t));
  };

  const delTask = async (tid) => {
    await db.deleteTask(tid);
    setTasks(prev => prev.filter(t => t.id !== tid));
    if (detailTask?.id === tid) setDetailTask(null);
  };

  const addList = async (type, name) => {
    const list = await db.addList({ user_id: eUid, type, name });
    if (list) setLists(prev => [...prev, list]);
  };

  const delList = async (lid) => {
    await db.deleteList(lid);
    setLists(prev => prev.filter(l => l.id !== lid));
    setTasks(prev => prev.filter(t => t.list_id !== lid));
    setSelIds(p => p.filter(i => i !== lid));
  };

  const addUser = async (name, pin) => {
    const user = await db.addUser({ name, pin, is_admin: false });
    if (user) {
      setUsers(prev => [...prev, user]);
      for (const dl of DEFAULT_LISTS) {
        const list = await db.addList({ user_id: user.id, type: dl.type, name: dl.name });
        if (list) setLists(prev => [...prev, list]);
      }
    }
  };

  const updateUser = async (id, updates) => {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.pin !== undefined) dbUpdates.pin = updates.pin;
    if (updates.isAdmin !== undefined) dbUpdates.is_admin = updates.isAdmin;
    const updated = await db.updateUser(id, dbUpdates);
    if (updated) setUsers(prev => prev.map(u => u.id === id ? updated : u));
  };

  const deleteUser = async (id) => {
    await db.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    setLists(prev => prev.filter(l => l.user_id !== id));
    setTasks(prev => prev.filter(t => t.user_id !== id));
  };

  const openDetail = async (task) => {
    setDetailTask(task);
    const a = await db.getAudit(task.id);
    setDetailAudit(a);
  };

  const uMetrics = isA ? users.map(u => { const ut = tasks.filter(t => t.user_id === u.id); return { ...u, open: ut.filter(t => t.status === "open").length, inP: ut.filter(t => t.status === "in_progress").length, hold: ut.filter(t => t.status === "on_hold").length, done: ut.filter(t => t.status === "complete").length, total: ut.length }; }) : [];
  const allAct = isA ? users.map(u => ({ user: u, lists: lists.filter(l => l.user_id === u.id).map(l => ({ ...l, tasks: tasks.filter(t => t.list_id === l.id && t.status !== "complete") })).filter(l => l.tasks.length > 0) })).filter(u => u.lists.length > 0) : [];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: F, transition: "background 0.3s" }}>
      <header style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.dark})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 5, overflow: "hidden" }}><img src={LOGO_W} alt="CMI" style={{ width: "100%", objectFit: "contain" }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.4 }}>CMI Valve Tracker</div>
            <div style={{ fontSize: 13, color: t.muted }}>{currentUser.name}{isA ? " · Admin" : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <HBtn t={t} active={isHome} onClick={() => { setSelIds([]); setActiveOpen(false); setMetricsOpen(false); setAdminOpen(false); }}><Icon name="home" size={15} color={isHome ? "#fff" : t.muted} /> Home</HBtn>
          {isA && <>
            <HBtn t={t} active={activeOpen} onClick={() => { setActiveOpen(!activeOpen); setMetricsOpen(false); setSelIds([]); }}><Icon name="bolt" size={15} color={activeOpen ? "#fff" : t.muted} /> Active</HBtn>
            <HBtn t={t} active={metricsOpen} onClick={() => { setMetricsOpen(!metricsOpen); setActiveOpen(false); setSelIds([]); }}><Icon name="chart" size={15} color={metricsOpen ? "#fff" : t.muted} /> Metrics</HBtn>
            <HBtn t={t} active={adminOpen} onClick={() => setAdminOpen(!adminOpen)}><Icon name="settings" size={15} color={adminOpen ? "#fff" : t.muted} /> Admin</HBtn>
          </>}
          <button onClick={loadAll} title="Refresh data" style={{ ...br, width: 38, height: 38, borderRadius: 10, background: t.card, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="refresh" size={16} color={t.muted} /></button>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ ...br, width: 38, height: 38, borderRadius: 10, background: t.card, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={theme === "dark" ? "sun" : "moon"} size={16} color={t.muted} /></button>
          <button onClick={() => { setCurrentUser(null); setSelIds([]); }} style={{ ...br, height: 38, borderRadius: 10, color: t.muted, border: `1px solid ${t.border}`, fontSize: 13, cursor: "pointer", padding: "0 14px", fontWeight: 500 }}>Sign Out</button>
        </div>
      </header>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 28px" }}>
        {adminOpen && <AdminPanel t={t} users={users} currentUser={currentUser} onAdd={addUser} onUpdate={updateUser} onDelete={deleteUser} onClose={() => setAdminOpen(false)} />}
        {metricsOpen && <Metrics t={t} data={uMetrics} />}
        {activeOpen && <AllActive t={t} data={allAct} onTask={openDetail} onStatus={chgStatus} />}

        {!metricsOpen && !activeOpen && <>
          {isA ? (
            <div style={{ marginBottom: 24 }}>
              {users.map(u => {
                const uL = lists.filter(l => l.user_id === u.id);
                if (uL.length === 0) return null;
                const collapsed = collapsedUsers[u.id];
                const selectedCount = uL.filter(l => selIds.includes(l.id)).length;
                const totalActive = uL.reduce((sum, l) => sum + gActive(l.id), 0);
                return <div key={u.id} style={{ marginBottom: 6 }}>
                  <button onClick={() => setCollapsedUsers(p => ({ ...p, [u.id]: !p[u.id] }))}
                    style={{ ...br, fontSize: 12, color: t.muted, marginBottom: collapsed ? 0 : 8, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
                    <Icon name={collapsed ? "chevRight" : "chevDown"} size={12} color={t.muted} />
                    {u.name}'s Lists
                    {totalActive > 0 && <span style={{ background: BRAND.faint, color: BRAND.primary, borderRadius: 8, padding: "1px 6px", fontSize: 11, fontWeight: 700, textTransform: "none", letterSpacing: 0 }}>{totalActive} open</span>}
                    {selectedCount > 0 && <span style={{ background: BRAND.primary, color: "#fff", borderRadius: 8, padding: "1px 6px", fontSize: 11, fontWeight: 700, textTransform: "none", letterSpacing: 0 }}>{selectedCount} selected</span>}
                  </button>
                  {!collapsed && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    {uL.map(l => {
                      const act = selIds.includes(l.id); const c = gActive(l.id);
                      return <button key={l.id} onClick={() => setSelIds(p => p.includes(l.id) ? p.filter(x => x !== l.id) : [...p, l.id])}
                        style={{ ...br, padding: "10px 20px", borderRadius: 12, fontSize: 14, cursor: "pointer", background: act ? BRAND.primary : t.card, color: act ? "#fff" : t.text, border: `1px solid ${act ? BRAND.primary : t.border}`, fontWeight: act ? 600 : 400, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon name={LIST_ICONS[l.type]} size={15} color={act ? "#fff" : t.muted} />
                        {l.name}
                        {c > 0 && <span style={{ background: act ? "rgba(255,255,255,0.25)" : BRAND.faint, color: act ? "#fff" : BRAND.primary, borderRadius: 10, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{c}</span>}
                      </button>;
                    })}
                  </div>}
                </div>;
              })}
              {selIds.length > 0 && <button onClick={() => setSelIds([])} style={{ ...br, padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", color: t.muted, border: `1px solid ${t.border}`, marginTop: 4, fontWeight: 500 }}>Clear selection</button>}
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: t.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>My Lists</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {uLists.map(l => {
                  const act = selIds.includes(l.id); const c = gActive(l.id);
                  return <button key={l.id} onClick={() => setSelIds(p => p.includes(l.id) ? p.filter(x => x !== l.id) : [...p, l.id])}
                    style={{ ...br, padding: "10px 20px", borderRadius: 12, fontSize: 14, cursor: "pointer", background: act ? BRAND.primary : t.card, color: act ? "#fff" : t.text, border: `1px solid ${act ? BRAND.primary : t.border}`, fontWeight: act ? 600 : 400, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name={LIST_ICONS[l.type]} size={15} color={act ? "#fff" : t.muted} />
                    {l.name}
                    {c > 0 && <span style={{ background: act ? "rgba(255,255,255,0.25)" : BRAND.faint, color: act ? "#fff" : BRAND.primary, borderRadius: 10, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{c}</span>}
                  </button>;
                })}
                <NewList t={t} onAdd={addList} />
              </div>
            </div>
          )}

          {aLists.length === 0 ? (
            <Dashboard t={t} uLists={uLists} tasks={tasks} users={users} cur={currentUser} isA={isA} eUid={eUid} onSel={id => setSelIds([id])} gActive={gActive} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(aLists.length, 4)}, 1fr)`, gap: 16 }}>
              {aLists.map(l => {
                const owner = users.find(u => u.id === l.user_id);
                return <ListPanel key={l.id} list={l} tasks={gTasks(l.id)} t={t}
                  ownerName={isA ? owner?.name?.split(" ")[0] : null}
                  showDone={showDone[l.id]} togDone={() => setShowDone(p => ({ ...p, [l.id]: !p[l.id] }))}
                  onAdd={d => addTask(l.id, d)} onStatus={chgStatus} onStar={togStar} onTask={openDetail}
                  onDel={() => delList(l.id)} qaOpen={qaOpen === l.id} setQa={v => setQaOpen(v ? l.id : null)} />;
              })}
            </div>
          )}
        </>}
      </div>

      {detailTask && <Detail task={detailTask} list={lists.find(l => l.id === detailTask.list_id)}
        audit={detailAudit} users={users} t={t}
        onClose={() => setDetailTask(null)}
        onUpd={async up => { const updated = await updTask(detailTask.id, up); if (updated) setDetailTask(updated); }}
        onStatus={async s => { await chgStatus(detailTask.id, s); setDetailTask(prev => ({ ...prev, status: s })); }}
        onDel={() => delTask(detailTask.id)} />}
    </div>
  );
}

// ─── All UI Components (same as before, adapted for snake_case DB fields) ────

function HBtn({ t, children, active, onClick }) {
  return <button onClick={onClick} style={{ ...br, padding: "8px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500,
    background: active ? BRAND.primary : t.card, color: active ? "#fff" : t.muted,
    border: `1px solid ${active ? BRAND.primary : t.border}`, transition: "all 0.2s",
    display: "flex", alignItems: "center", gap: 6 }}>{children}</button>;
}

function Login({ users, onLogin, theme, setTheme }) {
  const [pin, setPin] = useState(""); const [err, setErr] = useState(""); const t = themes[theme];
  const go = () => { const u = users.find(u => u.pin === pin); if (u) { onLogin(u); setPin(""); setErr(""); } else { setErr("Invalid PIN"); setPin(""); } };
  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ width: 380, padding: 40, textAlign: "center" }}>
        <div style={{ width: 180, marginBottom: 28, display: "inline-block" }}><img src={theme === "dark" ? LOGO_W : LOGO_D} alt="CMI Valve" style={{ width: "100%", objectFit: "contain" }} /></div>
        <h1 style={{ color: t.text, fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.5 }}>CMI Valve Tracker</h1>
        <p style={{ color: t.muted, fontSize: 15, margin: "0 0 36px" }}>Enter your PIN to continue</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 52, height: 60, borderRadius: 12, background: t.card, border: `2px solid ${pin[i] ? BRAND.primary : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: t.text, transition: "all 0.2s" }}>{pin[i] ? "•" : ""}</div>)}
        </div>
        <input type="tel" maxLength={4} value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0,4)); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && pin.length === 4 && go()} style={{ position: "absolute", opacity: 0 }} autoFocus />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 260, margin: "0 auto 20px" }}>
          {[1,2,3,4,5,6,7,8,9,null,0,"del"].map((n, i) => n === null ? <div key={i} /> : (
            <button key={i} onClick={() => { if (n === "del") setPin(p => p.slice(0,-1)); else if (pin.length < 4) setPin(p => p + n); }}
              style={{ ...br, width: "100%", height: 56, borderRadius: 12, fontSize: n === "del" ? 13 : 22, fontWeight: 600, cursor: "pointer", background: t.card, color: t.text, border: `1px solid ${t.border}`, transition: "all 0.15s" }}>
              {n === "del" ? <Icon name="x" size={16} color={t.muted} /> : n}
            </button>
          ))}
        </div>
        {err && <div style={{ color: "#c46b6b", fontSize: 14, marginBottom: 14, fontWeight: 500 }}>{err}</div>}
        <button onClick={go} disabled={pin.length < 4}
          style={{ ...br, width: "100%", maxWidth: 260, padding: "15px 0", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: pin.length === 4 ? "pointer" : "default",
            background: pin.length === 4 ? `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.dark})` : t.card,
            color: pin.length === 4 ? "#fff" : t.muted, transition: "all 0.25s",
            boxShadow: pin.length === 4 ? "0 6px 24px rgba(124,107,196,0.3)" : "none" }}>Unlock</button>
        <div style={{ marginTop: 24 }}><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ ...br, cursor: "pointer", padding: 8 }}><Icon name={theme === "dark" ? "sun" : "moon"} size={20} color={t.muted} /></button></div>
      </div>
    </div>
  );
}

function Dashboard({ t, uLists, tasks, users, cur, isA, eUid, onSel, gActive }) {
  const un = isA ? users.find(u => u.id === eUid)?.name : cur.name;
  const ut = tasks.filter(tk => tk.user_id === eUid);
  const o = ut.filter(tk => tk.status === "open").length;
  const ip = ut.filter(tk => tk.status === "in_progress").length;
  const oh = ut.filter(tk => tk.status === "on_hold").length;
  const d = ut.filter(tk => tk.status === "complete").length;
  const recent = [...ut].sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5);
  const today = new Date().toISOString().split("T")[0];
  const overdue = ut.filter(tk => tk.due_date && tk.due_date < today && tk.status !== "complete");
  const cards = [
    { l: "Open", c: o, col: BRAND.primary }, { l: "In Progress", c: ip, col: BRAND.light },
    { l: "On Hold", c: oh, col: "#8a8a8a" }, { l: "Completed", c: d, col: BRAND.dark },
  ];
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  return <div>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{greet}, {un?.split(" ")[0]}</h2>
      <p style={{ margin: 0, fontSize: 15, color: t.muted }}>{o + ip + oh} open items · {d} completed</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
      {cards.map(s => <div key={s.l} style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: s.col, lineHeight: 1 }}>{s.c}</div>
        <div style={{ fontSize: 13, color: t.muted, marginTop: 6, fontWeight: 500 }}>{s.l}</div>
      </div>)}
    </div>
    {overdue.length > 0 && <div style={{ background: "rgba(196,107,107,0.08)", border: "1px solid rgba(196,107,107,0.2)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Icon name="alert" size={18} color="#c46b6b" />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#c46b6b", marginBottom: 4 }}>{overdue.length} overdue item{overdue.length > 1 ? "s" : ""}</div>
        {overdue.slice(0,3).map(tk => <div key={tk.id} style={{ fontSize: 13, color: t.text, padding: "2px 0" }}>{tk.customer ? `${tk.customer} — ` : ""}{tk.reference || "Untitled"} <span style={{ color: t.muted }}>· due {fmtDate(tk.due_date)}</span></div>)}
      </div>
    </div>}
    <div style={{ fontSize: 12, color: t.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Your Lists</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 32 }}>
      {uLists.map(l => {
        const ac = gActive(l.id); const dc = tasks.filter(tk => tk.list_id === l.id && tk.status === "complete").length;
        return <div key={l.id} onClick={() => onSel(l.id)} style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.primary; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND.faint, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={LIST_ICONS[l.type]} size={20} /></div>
            {ac > 0 && <span style={{ background: BRAND.faint, color: BRAND.primary, borderRadius: 10, padding: "3px 10px", fontSize: 13, fontWeight: 700 }}>{ac}</span>}
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{l.name}</div>
          <div style={{ fontSize: 13, color: t.muted }}>{ac} active · {dc} done</div>
        </div>;
      })}
    </div>
    {recent.length > 0 && <div>
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Recently Updated</div>
      <div style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        {recent.map((tk, i) => {
          const st = STATUSES.find(s => s.key === tk.status);
          const title = tk.title || [tk.customer, tk.reference].filter(Boolean).join(" — ") || "Untitled";
          return <div key={tk.id} style={{ padding: "14px 20px", borderBottom: i < recent.length - 1 ? `1px solid ${t.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: st.color, flexShrink: 0 }} />
            <span style={{ fontSize: 14, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{title}</span>
            <span style={{ fontSize: 13, color: t.muted, flexShrink: 0 }}>{fmtDateTime(tk.updated_at)}</span>
          </div>;
        })}
      </div>
    </div>}
  </div>;
}

function ListPanel({ list, tasks, t, showDone, togDone, onAdd, onStatus, onStar, onTask, onDel, qaOpen, setQa, ownerName }) {
  const active = tasks.filter(tk => tk.status !== "complete");
  const done = tasks.filter(tk => tk.status === "complete");
  const sorted = [...active].sort((a,b) => { if (a.starred !== b.starred) return b.starred ? 1 : -1; return new Date(b.date_received || b.created_at) - new Date(a.date_received || a.created_at); });
  return <div style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 300 }}>
    <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>{list.name}</div>
        <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{ownerName ? `${ownerName} · ` : ""}{LIST_TYPES[list.type]?.label} · {active.length} open</div>
      </div>
      <button onClick={() => setQa(!qaOpen)} style={{ ...br, width: 34, height: 34, borderRadius: 10, background: BRAND.primary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={16} color="#fff" /></button>
    </div>
    {qaOpen && <QuickAdd list={list} t={t} onAdd={onAdd} onX={() => setQa(false)} />}
    <div style={{ flex: 1, overflowY: "auto" }}>
      {sorted.length === 0 && !qaOpen && <div style={{ padding: "40px 20px", textAlign: "center", color: t.muted, fontSize: 14 }}>No open items</div>}
      {sorted.map(tk => <TRow key={tk.id} task={tk} list={list} t={t} onStatus={onStatus} onStar={onStar} onClick={() => onTask(tk)} />)}
      {done.length > 0 && <>
        <button onClick={togDone} style={{ ...br, width: "100%", padding: "12px 20px", color: t.muted, fontSize: 13, cursor: "pointer", textAlign: "left", borderTop: `1px solid ${t.border}`, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name={showDone ? "chevDown" : "chevRight"} size={14} color={t.muted} /> Completed ({done.length})
        </button>
        {showDone && done.map(tk => <TRow key={tk.id} task={tk} list={list} t={t} onStatus={onStatus} onStar={onStar} onClick={() => onTask(tk)} done />)}
      </>}
    </div>
  </div>;
}

function TRow({ task, list, t, onStatus, onStar, onClick, done }) {
  const isO = list.type !== "tasks";
  const title = task.title || (isO ? [task.customer, task.reference].filter(Boolean).join(" — ") : task.reference) || "Untitled";
  return <div onClick={onClick} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderBottom: `1px solid ${t.border}`, opacity: done ? 0.4 : 1, transition: "all 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.background = t.cardHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <button onClick={e => { e.stopPropagation(); onStar(task.id); }} style={{ ...br, cursor: "pointer", padding: 4, opacity: task.starred ? 1 : 0.2, transition: "all 0.15s", flexShrink: 0 }}>
      <Icon name="star" size={15} color={task.starred ? BRAND.primary : t.muted} />
    </button>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 500, textDecoration: done ? "line-through" : "none", color: done ? t.muted : t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      {isO && (task.amount || task.due_date) && <div style={{ fontSize: 12, color: t.muted, marginTop: 3, display: "flex", gap: 10 }}>
        {task.amount && <span>${Number(task.amount).toLocaleString()}</span>}
        {task.due_date && <span>Due {fmtDate(task.due_date)}</span>}
      </div>}
    </div>
    <SBadge status={task.status} onClick={e => { e.stopPropagation(); const i = STATUSES.findIndex(s => s.key === task.status); onStatus(task.id, STATUSES[(i+1)%STATUSES.length].key); }} />
  </div>;
}

function SBadge({ status, onClick }) {
  const s = STATUSES.find(x => x.key === status);
  return <button onClick={onClick} style={{ ...br, padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: s.bg, color: s.color, border: `1px solid ${s.color}20`, whiteSpace: "nowrap", transition: "all 0.15s" }}>{s.label}</button>;
}

function QuickAdd({ list, t, onAdd, onX }) {
  const isO = list.type !== "tasks";
  const [c, sC] = useState(""); const [r, sR] = useState(""); const [a, sA] = useState(""); const [d, sD] = useState("");
  const ref = useRef(); useEffect(() => ref.current?.focus(), []);
  const go = () => { if (!r && !c) return; onAdd({ customer: c, reference: r, amount: a, dueDate: d, dateReceived: new Date().toISOString().split("T")[0] }); sC(""); sR(""); sA(""); sD(""); };
  const iS = { ...br, width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 14, background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, boxSizing: "border-box" };
  return <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, background: t.cardHover }}>
    {isO && <input value={c} onChange={e => sC(e.target.value)} placeholder="Customer" style={{ ...iS, marginBottom: 8 }} />}
    <input ref={ref} value={r} onChange={e => sR(e.target.value)} placeholder={isO ? "Reference / Description" : "Task description"} style={{ ...iS, marginBottom: 8 }} onKeyDown={e => e.key === "Enter" && go()} />
    {isO && <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      <input value={a} onChange={e => sA(e.target.value)} placeholder="$ Amount" style={{ ...iS, flex: 1 }} type="number" />
      <input value={d} onChange={e => sD(e.target.value)} style={{ ...iS, flex: 1 }} type="date" />
    </div>}
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={go} style={{ ...br, flex: 1, padding: "10px 0", borderRadius: 10, background: BRAND.primary, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add</button>
      <button onClick={onX} style={{ ...br, padding: "10px 18px", borderRadius: 10, background: t.card, color: t.muted, fontSize: 14, cursor: "pointer", border: `1px solid ${t.border}`, fontWeight: 500 }}>Cancel</button>
    </div>
  </div>;
}

function Detail({ task, list, audit, users, t, onClose, onUpd, onStatus, onDel }) {
  const isO = list?.type !== "tasks";
  const [notes, setNotes] = useState(task.notes || "");
  const [eTitle, setET] = useState(false); const [title, setT] = useState(task.title || "");
  const dTitle = task.title || (isO ? [task.customer, task.reference].filter(Boolean).join(" — ") : task.reference) || "Untitled";
  return <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: t.overlay }} />
    <div style={{ position: "relative", width: "100%", maxWidth: 500, background: t.bg, borderLeft: `1px solid ${t.border}`, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: t.muted, marginBottom: 8 }}>{list?.name} · {LIST_TYPES[list?.type]?.label}</div>
          {eTitle ? <input value={title} onChange={e => setT(e.target.value)} onBlur={() => { onUpd({ title }); setET(false); }}
            onKeyDown={e => e.key === "Enter" && (onUpd({ title }), setET(false))}
            style={{ ...br, width: "100%", fontSize: 20, fontWeight: 700, background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", boxSizing: "border-box" }} autoFocus />
          : <h2 onClick={() => setET(true)} style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text, cursor: "pointer", letterSpacing: -0.3 }}>{dTitle}</h2>}
        </div>
        <button onClick={onClose} style={{ ...br, cursor: "pointer", padding: "0 0 0 16px" }}><Icon name="x" size={20} color={t.muted} /></button>
      </div>
      <div style={{ padding: "20px 24px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: t.muted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Status</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUSES.map(s => <button key={s.key} onClick={() => onStatus(s.key)}
              style={{ ...br, padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: task.status === s.key ? s.bg : "transparent", color: task.status === s.key ? s.color : t.muted,
                border: `1px solid ${task.status === s.key ? s.color + "40" : t.border}`, transition: "all 0.15s" }}>{s.label}</button>)}
          </div>
        </div>
        {isO && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Fld l="Customer" v={task.customer} t={t} ch={v => onUpd({ customer: v })} />
          <Fld l="Reference" v={task.reference} t={t} ch={v => onUpd({ reference: v })} />
          <Fld l="Amount ($)" v={task.amount} t={t} ch={v => onUpd({ amount: v })} ty="number" />
          <Fld l="Date Received" v={task.date_received} t={t} ch={v => onUpd({ dateReceived: v })} ty="date" />
          <Fld l="Due Date" v={task.due_date} t={t} ch={v => onUpd({ dueDate: v })} ty="date" />
        </div>}
        {!isO && <div style={{ marginBottom: 20 }}><Fld l="Description" v={task.reference} t={t} ch={v => onUpd({ reference: v })} /></div>}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: t.muted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => onUpd({ notes })} placeholder="Add notes..."
            style={{ ...br, width: "100%", minHeight: 90, padding: 12, borderRadius: 10, fontSize: 14, background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: t.muted, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Activity Log</label>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {audit.length === 0 && <div style={{ fontSize: 13, color: t.muted }}>No activity yet</div>}
            {[...audit].reverse().map(a => {
              const u = users.find(u => u.id === a.user_id);
              return <div key={a.id} style={{ padding: "8px 0", borderBottom: `1px solid ${t.border}`, fontSize: 13 }}>
                <span style={{ color: BRAND.primary, fontWeight: 600 }}>{u?.name || "System"}</span>
                <span style={{ color: t.muted }}> · {a.action} · </span><span>{a.detail}</span>
                <div style={{ fontSize: 12, color: t.muted, marginTop: 3 }}>{fmtDateTime(a.created_at)}</div>
              </div>;
            })}
          </div>
        </div>
      </div>
      <div style={{ padding: "14px 24px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onDel} style={{ ...br, padding: "10px 18px", borderRadius: 10, color: "#c46b6b", fontSize: 13, cursor: "pointer", border: "1px solid rgba(196,107,107,0.2)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="trash" size={14} color="#c46b6b" /> Delete
        </button>
      </div>
    </div>
  </div>;
}

function Fld({ l, v, t, ch, ty = "text" }) {
  const [val, setVal] = useState(v || "");
  return <div>
    <label style={{ fontSize: 12, color: t.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{l}</label>
    <input value={val} onChange={e => setVal(e.target.value)} onBlur={() => ch(val)} type={ty}
      style={{ ...br, width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 14, background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, boxSizing: "border-box" }} />
  </div>;
}

function NewList({ t, onAdd }) {
  const [o, sO] = useState(false); const [n, sN] = useState(""); const [ty, sTy] = useState("quotes");
  if (!o) return <button onClick={() => sO(true)} style={{ ...br, padding: "10px 20px", borderRadius: 12, fontSize: 14, cursor: "pointer", color: t.muted, border: `1px dashed ${t.border}`, fontWeight: 500 }}>+ New List</button>;
  return <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <select value={ty} onChange={e => sTy(e.target.value)} style={{ ...br, padding: "10px 12px", borderRadius: 10, fontSize: 13, background: t.card, color: t.text, border: `1px solid ${t.border}` }}>
      {Object.entries(LIST_TYPES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
    </select>
    <input value={n} onChange={e => sN(e.target.value)} placeholder="List name" style={{ ...br, padding: "10px 12px", borderRadius: 10, fontSize: 13, background: t.card, color: t.text, border: `1px solid ${t.border}`, width: 140 }}
      onKeyDown={e => e.key === "Enter" && n && (onAdd(ty, n), sN(""), sO(false))} />
    <button onClick={() => { if (n) { onAdd(ty, n); sN(""); sO(false); } }} style={{ ...br, padding: "10px 16px", borderRadius: 10, background: BRAND.primary, color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Add</button>
    <button onClick={() => sO(false)} style={{ ...br, cursor: "pointer", padding: 4 }}><Icon name="x" size={16} color={t.muted} /></button>
  </div>;
}

function AdminPanel({ t, users, currentUser, onAdd, onUpdate, onDelete, onClose }) {
  const [newName, setNewName] = useState(""); const [newPin, setNewPin] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(""); const [editPin, setEditPin] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const startEdit = (u) => { setEditId(u.id); setEditName(u.name); setEditPin(u.pin); };
  const saveEdit = () => { if (editName && editPin.length === 4) { onUpdate(editId, { name: editName, pin: editPin }); setEditId(null); } };
  const iS = { ...br, padding: "8px 10px", borderRadius: 8, fontSize: 14, background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, boxSizing: "border-box" };
  return <div style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: 24, marginBottom: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Team Management</h3>
      <button onClick={onClose} style={{ ...br, cursor: "pointer" }}><Icon name="x" size={18} color={t.muted} /></button>
    </div>
    <div style={{ marginBottom: 20 }}>
      {users.map(u => {
        const isEditing = editId === u.id;
        const isSelf = u.id === currentUser.id;
        if (isEditing) return <div key={u.id} style={{ padding: "12px 0", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...iS, flex: 1 }} placeholder="Name" />
            <input value={editPin} onChange={e => setEditPin(e.target.value.replace(/\D/g, "").slice(0,4))} style={{ ...iS, width: 80, textAlign: "center" }} placeholder="PIN" maxLength={4} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.muted, cursor: "pointer" }}>
              <input type="checkbox" checked={u.is_admin} onChange={e => onUpdate(u.id, { isAdmin: e.target.checked })} style={{ accentColor: BRAND.primary, width: 16, height: 16 }} /> Admin access
            </label>
            <div style={{ flex: 1 }} />
            <button onClick={saveEdit} style={{ ...br, padding: "6px 14px", borderRadius: 8, background: BRAND.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
            <button onClick={() => setEditId(null)} style={{ ...br, padding: "6px 14px", borderRadius: 8, color: t.muted, fontSize: 13, cursor: "pointer", border: `1px solid ${t.border}` }}>Cancel</button>
          </div>
        </div>;
        return <div key={u.id} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${t.border}`, gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{u.name}
              {u.is_admin && <span style={{ color: BRAND.primary, fontSize: 12, fontWeight: 600, marginLeft: 8, background: BRAND.faint, padding: "2px 8px", borderRadius: 6 }}>ADMIN</span>}
            </div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>PIN: {u.pin}</div>
          </div>
          <button onClick={() => startEdit(u)} style={{ ...br, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: BRAND.primary, border: `1px solid ${BRAND.border}`, fontWeight: 500 }}>Edit</button>
          {!isSelf && (confirmDel === u.id
            ? <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => { onDelete(u.id); setConfirmDel(null); }} style={{ ...br, padding: "6px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer", color: "#fff", background: "#c46b6b", fontWeight: 600 }}>Confirm</button>
                <button onClick={() => setConfirmDel(null)} style={{ ...br, padding: "6px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer", color: t.muted, border: `1px solid ${t.border}` }}>No</button>
              </div>
            : <button onClick={() => setConfirmDel(u.id)} style={{ ...br, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#c46b6b", border: "1px solid rgba(196,107,107,0.2)", fontWeight: 500 }}>Remove</button>
          )}
        </div>;
      })}
    </div>
    <div style={{ fontSize: 12, color: t.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Add New Team Member</div>
    <div style={{ display: "flex", gap: 8 }}>
      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" style={{ ...iS, flex: 1 }} />
      <input value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, "").slice(0,4))} placeholder="PIN" maxLength={4} style={{ ...iS, width: 80, textAlign: "center" }} />
      <button onClick={() => { if (newName && newPin.length === 4) { onAdd(newName, newPin); setNewName(""); setNewPin(""); } }} style={{ ...br, padding: "10px 20px", borderRadius: 10, background: BRAND.primary, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add</button>
    </div>
  </div>;
}

function Metrics({ t, data }) {
  return <div style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: 24, marginBottom: 24 }}>
    <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Team Metrics</h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
      {data.map(u => <div key={u.id} style={{ padding: 20, borderRadius: 12, border: `1px solid ${t.border}`, background: t.bg }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>{u.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
          {[{l:"Open",v:u.open,c:BRAND.primary},{l:"In Prog",v:u.inP,c:BRAND.light},{l:"On Hold",v:u.hold,c:"#8a8a8a"},{l:"Done",v:u.done,c:BRAND.dark}].map(s =>
            <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.c }} />
              <span style={{ color: t.muted }}>{s.l}:</span><span style={{ fontWeight: 600 }}>{s.v}</span>
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: t.muted }}>Total: {u.total}</div>
      </div>)}
    </div>
  </div>;
}

function AllActive({ t, data, onTask, onStatus }) {
  return <div>
    <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="bolt" size={20} /> All Active Items
    </h3>
    {data.length === 0 && <div style={{ color: t.muted, textAlign: "center", padding: 48, fontSize: 15 }}>No active items</div>}
    {data.map(u => <div key={u.user.id} style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.primary, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.5 }}>{u.user.name}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(u.lists.length, 3)}, 1fr)`, gap: 14 }}>
        {u.lists.map(l => <div key={l.id} style={{ background: t.card, borderRadius: 12, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.muted }}>{l.name} ({l.tasks.length})</div>
          {l.tasks.map(tk => {
            const title = tk.title || [tk.customer, tk.reference].filter(Boolean).join(" — ") || "Untitled";
            return <div key={tk.id} onClick={() => onTask(tk)} style={{ padding: "10px 16px", borderBottom: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = t.cardHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <SBadge status={tk.status} onClick={e => { e.stopPropagation(); const i = STATUSES.findIndex(s => s.key === tk.status); onStatus(tk.id, STATUSES[(i+1)%STATUSES.length].key); }} />
              <span style={{ fontSize: 13, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{title}</span>
              {tk.starred && <Icon name="star" size={14} />}
            </div>;
          })}
        </div>)}
      </div>
    </div>)}
  </div>;
}
