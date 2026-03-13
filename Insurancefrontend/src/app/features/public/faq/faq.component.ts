import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    tags: string[];
    isExpanded: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden transition-colors duration-500 relative">
      
      <!-- Ambient Background Glow -->
      <div class="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-40">
        <div class="h-[40rem] w-[40rem] bg-blue-600/20 rounded-full blur-[120px] absolute -top-20 -left-20"></div>
        <div class="h-[40rem] w-[40rem] bg-yellow-600/20 rounded-full blur-[120px] absolute top-1/2 right-[-10%] opacity-50"></div>
      </div>

      <!-- Background Sketches/Patterns -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen opacity-10">
          <div class="absolute inset-0 bg-[url('/images/home-bg.png')] bg-[length:600px]"></div>
          <img src="/images/logo-icon.png" class="absolute top-10 right-[-5%] w-[800px] h-[800px] object-contain opacity-10 -rotate-12">
          <img src="/images/logo-icon.png" class="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] object-contain opacity-10 rotate-12 transition-opacity duration-700">
      </div>

      <!-- Content Wrapper -->
      <div class="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
        
        <!-- Header Section -->
        <header class="text-center mb-16 animate-fade-in-up relative">
            <!-- Decorative Sketch Illustration (Background) -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10">
                <img src="/images/login-side-illus.png" class="w-full h-auto rotate-12">
            </div>

            <div class="flex items-center justify-center gap-4 mb-8">
                <a routerLink="/" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-600 to-blue-500 text-white shadow-xl shadow-yellow-500/20 border border-white/20 hover:scale-105 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </a>
                <h1 class="text-4xl md:text-6xl font-black tracking-tight outfit-font">
                    Frequently Asked <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600">Questions</span>
                </h1>
            </div>
            <p class="text-slate-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Everything you need to know about EventSure's AI-driven protection suite.
            </p>
        </header>

        <!-- Search & Filter Controls -->
        <section class="mb-12 space-y-8 animate-fade-in-up stagger-1">
            <!-- Search Bar -->
            <div class="relative max-w-3xl mx-auto group">
                <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg class="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input type="text" [(ngModel)]="searchQuery" (input)="filterFaqs()"
                    placeholder="Search by questions, keywords, or tags..."
                    class="block w-full pl-16 pr-6 py-6 bg-white dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-lg font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none shadow-2xl shadow-blue-500/5 dark:shadow-none transition-all outline-none">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:block">Press / to focus</span>
                </div>
            </div>

            <!-- Category Filters -->
            <div class="flex flex-wrap justify-center gap-3">
                <button *ngFor="let cat of categories" 
                    (click)="setActiveCategory(cat)"
                    [ngClass]="activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 border-blue-500' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-white/10 border-slate-200 dark:border-white/10'"
                    class="px-8 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest border transition-all active:scale-95">
                    {{ cat }}
                </button>
            </div>
        </section>

        <!-- FAQ List -->
        <div class="grid gap-6 animate-fade-in-up stagger-2">
            <div *ngFor="let faq of filteredFaqs" 
                 class="group bg-white dark:bg-neutral-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                
                <button (click)="faq.isExpanded = !faq.isExpanded" 
                    class="w-full flex items-center justify-between p-8 text-left focus:outline-none">
                    <div class="flex items-center gap-6">
                        <div [ngClass]="faq.isExpanded ? 'bg-blue-600 text-white rotate-90 scale-110' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-400'"
                             class="h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200 dark:border-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl md:text-2xl font-bold outfit-font transition-colors" [ngClass]="faq.isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-500'">
                                {{ faq.question }}
                            </h3>
                            <!-- Tags (Horizontal on Desktop, Hidden on mobile if not expanded) -->
                            <div class="mt-3 flex flex-wrap gap-2 transition-opacity" [ngClass]="faq.isExpanded ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'">
                                <span *ngFor="let tag of faq.tags" 
                                      class="px-3 py-1 bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-tighter rounded-full text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/10">
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </button>

                <!-- Expanded Content -->
                <div [style.maxHeight]="faq.isExpanded ? '500px' : '0'"
                    class="transition-all duration-500 ease-in-out px-8 pb-8 overflow-hidden">
                    <div class="pl-[4.5rem] border-t border-slate-100 dark:border-white/5 pt-6">
                        <p class="text-lg text-slate-600 dark:text-neutral-400 font-medium leading-[1.8] mb-6">
                            {{ faq.answer }}
                        </p>
                        <div class="flex items-center gap-4">
                            <span class="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Category:</span>
                            <span class="px-4 py-1.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest rounded-lg border border-blue-200/50 dark:border-blue-500/20">
                                {{ faq.category }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results State -->
            <div *ngIf="filteredFaqs.length === 0" class="text-center py-20 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-300 dark:border-white/10">
                <div class="h-20 w-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h4 class="text-2xl font-bold outfit-font mb-2">No results found</h4>
                <p class="text-slate-500 dark:text-neutral-400">We couldn't find any questions matching "{{ searchQuery }}". Try a different keyword.</p>
                <button (click)="searchQuery = ''; filterFaqs()" class="mt-6 text-blue-600 font-bold hover:underline">Clear search</button>
            </div>
        </div>

        <!-- Footer Call to Action -->
        <section class="mt-20 p-12 bg-gradient-to-br from-blue-600 to-yellow-600 rounded-[3rem] text-center text-white shadow-2xl shadow-blue-500/20 animate-fade-in-up stagger-3">
            <h2 class="text-3xl font-black outfit-font mb-4">Still have questions?</h2>
            <p class="text-yellow-100 text-lg mb-8 max-w-xl mx-auto font-medium leading-relaxed">
                If our FAQ didn't answer your concern, our agents and support crew are ready to assist you in real-time.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="mailto:support@eventsure.com" class="px-10 py-4 bg-white text-blue-600 rounded-2xl font-extrabold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>
                    Email Support
                </a>
                <a routerLink="/register" class="px-10 py-4 bg-black/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-extrabold hover:bg-white/10 transition-colors flex items-center gap-2">
                    Connect with an Agent
                </a>
            </div>
        </section>

        <!-- Dynamic Page Footer -->
        <footer class="mt-20 py-10 border-t border-slate-200 dark:border-white/5 text-center">
             <p class="text-slate-400 dark:text-neutral-600 text-xs font-bold uppercase tracking-[0.2em]">&copy; 2026 EventSure Insurance Ecosystem</p>
        </footer>

      </div>
    </div>
    `,
    styles: [`
        .outfit-font { font-family: 'Outfit', sans-serif; }
        .glass-overlay { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); }
        .blue-gradient-text {
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
    `]
})
export class FaqComponent implements OnInit {
    searchQuery: string = '';
    activeCategory: string = 'All';
    categories: string[] = ['All', 'General', 'Policies', 'Claims', 'Payments', 'Setup'];

    faqs: FaqItem[] = [
        {
            id: 1,
            category: 'General',
            question: 'What exactly is EventSure?',
            answer: 'EventSure is a premium AI-driven event insurance platform designed to protect your special occasions—from weddings and concerts to corporate seminars—against unexpected cancellations, weather impacts, venue accidents, and general liability risks.',
            tags: ['basics', 'overview', 'value'],
            isExpanded: false
        },
        {
            id: 2,
            category: 'Policies',
            question: 'How quickly can I get an insurance certificate?',
            answer: 'Efficiency is our hallmark. Once your application is reviewed by an agent, approved by the administrator, and the initial payment is confirmed, your Event Insurance Certificate is generated instantly. You can download the high-quality PDF directly from your dashboard.',
            tags: ['efficiency', 'certificate', 'download'],
            isExpanded: false
        },
        {
            id: 3,
            category: 'Claims',
            question: 'How does the AI Risk Scoring affect my claim?',
            answer: 'Our system calculates a real-time Risk Score for every claim based on factors like payment history, claim amount relative to estimated coverage, and sentiment analysis of the reason provided. Low risk scores (Green) often lead to priority settlement, while Elevated or Critical scores (Red) ensure our officers perform extra due diligence.',
            tags: ['ai', 'risk-engine', 'claims'],
            isExpanded: false
        },
        {
            id: 4,
            category: 'Payments',
            question: 'What payment plans do you offer?',
            answer: 'We offer flexible payment structures to suit your financial flow. You can choose from Monthly installments (for long-term event planning), 6-Month term payments (Half-yearly), or a single Full Annual payment for maximum convenience.',
            tags: ['finance', 'installments', 'billing'],
            isExpanded: false
        },
        {
            id: 5,
            category: 'Setup',
            question: 'What documents do I need to upload for a new request?',
            answer: 'To ensure a smooth assignment to an agent, you should provide identity proof (Aadhar/Passport) and a secondary document such as a Venue Booking Receipt, Event Arrangement Proof, or an Invitation Letter. This helps our agents tailor the policy to your specific scale.',
            tags: ['onboarding', 'documentation', 'kyc'],
            isExpanded: false
        },
        {
            id: 6,
            category: 'Claims',
            question: 'When can I file a claim?',
            answer: 'You can file a claim as soon as an insured event occurs, provided your policy is active and payments are up to date. The process is entirely digital—simply navigate to the Claims section and submit your evidence.',
            tags: ['support', 'incidents'],
            isExpanded: false
        },
        {
            id: 7,
            category: 'General',
            question: 'Is EventSure available for private home parties?',
            answer: 'Yes! While we excel at large-scale weddings and concerts, our "Many More" category is specifically designed for intimate private events, ensuring that even home celebrations have high-quality liability coverage.',
            tags: ['private-events', 'flexibility'],
            isExpanded: false
        },
        {
            id: 8,
            category: 'Setup',
            question: 'How is an agent assigned to my request?',
            answer: 'Our systematic workflow involves an Administrator who reviews your initial event details. To ensure expertise matching, the admin manually assigns a specialized agent who will then provide you with tailored policy suggestions.',
            tags: ['workflow', 'agents', 'assignment'],
            isExpanded: false
        },
        {
            id: 9,
            category: 'Policies',
            question: 'Is my insurance certificate legally signed?',
            answer: 'Absolutely. Every Event Insurance Certificate generated by EventSure includes an official digital signature and branding from our leadership team (e.g., Lakshmi Srujana G), ensuring the document is professional and ready for venue presentation.',
            tags: ['legal', 'signature', 'trust'],
            isExpanded: false
        }
    ];

    filteredFaqs: FaqItem[] = [];

    ngOnInit() {
        this.filterFaqs();
        // Expand the first one by default for better UI appeal
        if (this.faqs.length > 0) {
            this.faqs[0].isExpanded = true;
        }
    }

    setActiveCategory(category: string) {
        this.activeCategory = category;
        this.filterFaqs();
    }

    filterFaqs() {
        this.filteredFaqs = this.faqs.filter(faq => {
            const matchesSearch = this.searchQuery === '' || 
                faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                faq.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));
            
            const matchesCategory = this.activeCategory === 'All' || faq.category === this.activeCategory;
            
            return matchesSearch && matchesCategory;
        });
    }
}
