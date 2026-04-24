import { Brain, Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";

const menu = ["Dashboard", "Simulations", "History", "Profile"];

export const TopNav = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 glass-strong border-b border-border/50"
    >
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
              <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight">
              AegisMind <span className="text-gradient">X</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              Decision Battlefield
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {menu.map((item, i) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                i === 0
                  ? "text-foreground bg-primary/10 border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-primary/40 transition">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-primary/40 transition">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center font-display font-bold text-sm text-background ring-2 ring-primary/30">
            AX
          </div>
        </div>
      </div>
    </motion.header>
  );
};
