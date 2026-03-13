import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-yellow-50/60 dark:from-black dark:via-neutral-950 dark:to-indigo-950/20 text-slate-900 dark:text-white relative flex flex-col items-center overflow-x-hidden selection:bg-blue-600 selection:text-white font-sans transition-colors duration-500">
      
      <!-- Ambient Background Glow -->
      <div class="fixed inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen dark:mix-blend-color-dodge">
        <div class="h-[40rem] w-[40rem] bg-yellow-500/30 rounded-full blur-[140px] absolute -top-20 -left-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div class="h-[50rem] w-[50rem] bg-blue-600/30 rounded-full blur-[180px] absolute top-1/2 right-0 transform -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
        <div class="h-[30rem] w-[30rem] bg-blue-500/20 rounded-full blur-[120px] absolute bottom-0 left-1/4 animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]"></div>
      </div>

      <!-- Live Activity Ticker (Floating bottom left) -->
      <div class="fixed bottom-6 left-6 z-50 transition-all duration-700 transform"
           [ngClass]="activityVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 scale-95'">
          <div class="glass-overlay rounded-2xl p-4 flex items-center gap-3 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]">
              <div class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <p class="text-sm font-semibold text-slate-800 dark:text-neutral-200">{{ currentActivity }}</p>
          </div>
      </div>

      <!-- Content Wrapper -->
      <div class="relative z-10 w-full flex flex-col items-center">
        
        <!-- Navbar -->
        <div class="fixed top-6 w-full max-w-7xl mx-auto px-4 z-50 animate-fade-in-up">
            <nav class="flex items-center justify-between bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-none shadow-blue-500/10 rounded-3xl px-6 py-4 transition-all">
                <div class="flex items-center gap-4 group cursor-pointer">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-600 to-blue-500 text-white shadow-xl shadow-yellow-500/30 border border-white/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <span class="text-3xl font-extrabold tracking-tight outfit-font text-slate-900 dark:text-white transition-colors duration-300">Event<span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600 dark:from-yellow-400 dark:to-blue-500">Sure</span></span>
                </div>
                <div class="flex items-center gap-3 sm:gap-5">
                    
                    <!-- Dark Mode Toggle -->
                    <button (click)="toggleTheme()" class="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-400 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </button>

                    <!-- About Us Link -->
                    <a routerLink="/about" class="hidden sm:block text-sm font-bold outfit-font text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors uppercase tracking-widest pl-2">About Us</a>

                    <!-- FAQ Link -->
                    <a routerLink="/faq" class="hidden sm:block text-sm font-bold outfit-font text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors uppercase tracking-widest pl-2">FAQ</a>

                    <!-- Support Dropdown -->
                    <div class="relative group/support hidden md:block">
                        <button class="flex items-center gap-1.5 text-sm font-bold outfit-font text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors uppercase tracking-widest pl-2 focus:outline-none py-4">
                            Support
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transition-transform group-hover/support:rotate-180">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <div class="absolute right-0 top-full -mt-2 w-80 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl opacity-0 invisible group-hover/support:opacity-100 group-hover/support:visible transition-all duration-300 transform origin-top-right group-hover/support:-translate-y-1 translate-y-2 z-50 p-2">
                            
                            <!-- Helpline 1 -->
                            <a href="tel:18002088787" class="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group/item">
                                <div class="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg group-hover/item:scale-110 transition-transform shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Buy New Policy</p>
                                    <p class="text-lg font-bold outfit-font text-slate-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">1800-208-8787</p>
                                </div>
                            </a>

                            <div class="h-px w-full bg-slate-100 dark:bg-white/5 my-1"></div>

                            <!-- Helpline 2 -->
                            <a href="tel:18002585970" class="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group/item">
                                <div class="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg group-hover/item:scale-110 transition-transform shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Existing Policy</p>
                                    <p class="text-lg font-bold outfit-font text-slate-900 dark:text-white group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">1800-258-5970</p>
                                </div>
                            </a>

                            <div class="h-px w-full bg-slate-100 dark:bg-white/5 my-1"></div>

                            <!-- Helpline 3 -->
                            <a href="tel:18002585881" class="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group/item">
                                <div class="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 p-2 rounded-lg group-hover/item:scale-110 transition-transform shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Claim Support</p>
                                    <p class="text-lg font-bold outfit-font text-slate-900 dark:text-white group-hover/item:text-rose-600 dark:group-hover/item:text-rose-400 transition-colors">1800-258-5881</p>
                                </div>
                            </a>

                        </div>
                    </div>

                    <a routerLink="/register" class="px-6 py-3 bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-500 hover:to-blue-500 text-white rounded-xl font-bold outfit-font text-sm transition-all shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/60 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest ml-2 border border-yellow-400/50">Get Started</a>
                </div>
            </nav>
        </div>

        <!-- Custom Background Imagery Container for Entire Page -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen">
             <!-- Line Art Background Image (repeat or cover) -->
             <div class="absolute inset-0 bg-[url('/images/home-bg.png')] bg-[length:600px] opacity-[0.05] dark:opacity-[0.08]"></div>
             
             <!-- Large Logo pattern watermark 1 -->
             <img src="/images/logo-icon.png" class="absolute top-10 right-[-10%] w-[900px] h-[900px] object-contain opacity-[0.02] dark:opacity-[0.03] -rotate-12">
             
             <!-- Large Logo pattern watermark 2 -->
             <img src="/images/logo-icon.png" class="absolute top-[40%] left-[-5%] w-[600px] h-[600px] object-contain opacity-[0.02] dark:opacity-[0.03] rotate-12">
             
             <!-- Large Logo pattern watermark 3 -->
             <img src="/images/logo-icon.png" class="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] object-contain opacity-[0.02] dark:opacity-[0.03] -rotate-6">
             
             <!-- Gradient fade to merge smoothly into the rest of the page -->
             <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-50/80 dark:to-black/80 z-10"></div>
        </div>

        <!-- Hero Section -->
        <main class="w-full max-w-7xl mx-auto px-6 pt-36 pb-10 relative z-10">
          <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between min-h-[85vh]">

            <!-- LEFT: Text Content — centered vertically -->
            <div class="flex-1 flex flex-col justify-center animate-fade-in-up">

              <!-- Live pill badge -->
              <div class="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 text-xs font-bold uppercase tracking-widest mb-7 backdrop-blur-md animate-float-fast">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Your event, completely protected.
              </div>

              <!-- Main heading with highlights -->
              <h1 class="text-5xl sm:text-6xl md:text-[4.5rem] font-black tracking-tighter mb-5 leading-[1.08] outfit-font">
                <span class="block text-slate-900 dark:text-white transition-transform hover:scale-[1.02] duration-500">EventSure</span>
                <span class="block blue-gradient-text animate-bg-pan transition-transform hover:scale-[1.02] duration-500">Event Insurance</span>
              </h1>

              <!-- Tag line with highlighted keywords -->
              <p class="text-lg text-slate-600 dark:text-neutral-300 font-medium max-w-lg mb-3 tracking-wide leading-relaxed">
                Protect your special day from 
                <mark class="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded-md font-bold not-italic">cancellations</mark>, 
                <mark class="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-bold not-italic">weather risks</mark>, 
                <mark class="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-bold not-italic">venue damage</mark> & 
                <mark class="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-bold not-italic">liability</mark> — 
                get covered in minutes.
              </p>

              <!-- Stats Row -->
              <div class="flex flex-wrap items-center gap-5 mb-9 mt-3">
                <div class="flex items-center gap-2.5 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-2.5 shadow-sm">
                  <span class="text-2xl font-black text-blue-600 outfit-font leading-none">2,400+</span>
                  <span class="text-[10px] font-black text-slate-500 dark:text-neutral-400 uppercase tracking-wider leading-tight">Events<br>Covered</span>
                </div>
                <div class="flex items-center gap-2.5 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-2.5 shadow-sm">
                  <span class="text-2xl font-black text-yellow-600 outfit-font leading-none">₹50Cr+</span>
                  <span class="text-[10px] font-black text-slate-500 dark:text-neutral-400 uppercase tracking-wider leading-tight">Claims<br>Settled</span>
                </div>
                <div class="flex items-center gap-2.5 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-2.5 shadow-sm">
                  <span class="text-2xl font-black text-emerald-600 outfit-font leading-none">4.9★</span>
                  <span class="text-[10px] font-black text-slate-500 dark:text-neutral-400 uppercase tracking-wider leading-tight">Customer<br>Rating</span>
                </div>
              </div>

              <!-- CTAs -->
              <div class="flex flex-col sm:flex-row items-start gap-3 relative z-20">
                <a routerLink="/register" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-yellow-500 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white rounded-2xl font-extrabold text-base shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-5px_rgba(59,130,246,0.7)] hover:-translate-y-1 outfit-font group overflow-hidden relative text-center animate-pulse-glow">
                  <span class="relative z-10 transition-transform group-hover:scale-105 inline-block">Get Started Now</span>
                  <div class="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <a (click)="scrollToPlans()" class="w-full sm:w-auto px-8 py-4 glass-overlay hover:bg-white/50 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-base transition-all hover:-translate-y-1 outfit-font cursor-pointer flex items-center justify-center gap-2">
                  View Plans
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /></svg>
                </a>
              </div>
            </div>

            <!-- RIGHT: Rotating Ad Carousel -->
            <div class="flex-shrink-0 w-full lg:w-[360px] flex flex-col items-center justify-center animate-float">

              <!-- Card wrapper with min height to avoid layout jump -->
              <div class="relative w-full group" style="min-height: 460px;">

                <!-- Animated glow -->
                <div class="absolute -inset-3 rounded-[2.5rem] blur-2xl opacity-40 transition-all duration-700 pointer-events-none group-hover:opacity-60 group-hover:scale-105"
                     [ngClass]="adIndex === 0 ? 'bg-gradient-to-br from-red-300 to-amber-400 animate-bg-pan' : 'bg-gradient-to-br from-blue-400 to-yellow-500 animate-bg-pan'"></div>

                <!-- ═══ AD 1: Event Cancellation ═══ -->
                <div class="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/30 shadow-2xl transition-all duration-700 bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-neutral-900 dark:to-red-950/30 hover:scale-[1.02] cursor-pointer"
                     [ngClass]="adIndex === 0 ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 -translate-y-6 scale-95 z-0 pointer-events-none'">

                  <!-- TOP: EventSure label row -->
                  <div class="flex items-center justify-between px-5 pt-5 pb-3">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/30">
                      <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Cancellation Cover
                    </div>
                    <span class="text-[10px] font-black text-red-400 uppercase tracking-wider">EventSure™</span>
                  </div>

                  <!-- Image fills most of the card -->
                  <div class="relative mx-4 rounded-2xl overflow-hidden" style="height: 240px;">
                    <img src="/images/ad_event_cancelled.png" alt="Event Cancellation Insurance" 
                         class="w-full h-full object-cover object-top" />
                    <!-- Gradient overlay at bottom -->
                    <div class="absolute inset-0 bg-gradient-to-t from-rose-50/90 dark:from-neutral-900/90 via-transparent to-transparent"></div>
                  </div>

                  <!-- Ad copy below image -->
                  <div class="px-5 pt-3 pb-5 space-y-2">
                    <p class="text-base font-black text-slate-900 dark:text-white leading-tight outfit-font">
                      Cover 
                      <span class="text-red-600 underline decoration-wavy decoration-red-400/60 underline-offset-2">unexpected cancellations</span><br>
                      or losses at your event!
                    </p>
                    <p class="text-xs text-slate-500 dark:text-neutral-400 font-medium">Get protected before every booking.</p>
                    <div class="flex items-center justify-between pt-3 border-t border-red-100 dark:border-red-900/30">
                      <div>
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Starting at</p>
                        <p class="text-sm font-black text-red-600">₹499/event</p>
                      </div>
                      <a routerLink="/register" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5">
                        Get Cover →
                      </a>
                    </div>
                  </div>
                </div>

                <!-- ═══ AD 2: Festival Insurance ═══ -->
                <div class="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/30 shadow-2xl transition-all duration-700 hover:scale-[1.02] cursor-pointer"
                     [ngClass]="adIndex === 1 ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 translate-y-6 scale-95 z-0 pointer-events-none'">
                  <div class="relative bg-gradient-to-br from-blue-50 to-yellow-100 dark:from-neutral-900 dark:to-blue-950/40 overflow-hidden h-full">

                  <!-- Image fills top 60% -->
                  <div class="relative" style="height: 270px;">
                    <img src="/images/ad_festival_insurance.png" alt="Festival Event Insurance" 
                         class="w-full h-full object-cover object-top" />
                    <!-- Wave & gradient overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-transparent to-transparent"></div>
                    <!-- Badge on top of image -->
                    <div class="absolute top-4 left-4">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/30">
                        <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Festival &amp; Cultural Events
                      </span>
                    </div>
                    <!-- EventSure badge top-right -->
                    <span class="absolute top-4 right-4 text-[10px] font-black text-white/80 uppercase tracking-wider bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">EventSure™</span>
                    <!-- SVG wave at bottom -->
                    <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 400 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                      <path d="M0,10 C80,24 320,0 400,12 L400,24 L0,24 Z" class="fill-white dark:fill-neutral-950" />
                    </svg>
                  </div>

                  <!-- Text below image -->
                  <div class="bg-white dark:bg-neutral-950 px-5 pb-5 pt-1">
                    <p class="text-lg font-black text-slate-800 dark:text-white leading-tight outfit-font">
                      Ensure Safety This
                    </p>
                    <p class="text-lg font-black text-slate-800 dark:text-white leading-tight outfit-font">
                      Festival Season with
                    </p>
                    <p class="text-lg font-black outfit-font mb-2" style="background: linear-gradient(90deg, #7c3aed, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                      The Right Insurance!
                    </p>
                    <p class="text-xs text-slate-500 dark:text-neutral-400 font-medium mb-3">Holi, Diwali, Navratri &amp; more — protect every celebration.</p>
                    <div class="flex items-center justify-between pt-3 border-t border-yellow-100 dark:border-yellow-900/30">
                      <div>
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Starting at</p>
                        <p class="text-sm font-black text-yellow-600">₹699/event</p>
                      </div>
                      <a routerLink="/register" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-yellow-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5">
                        Get Cover →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              </div>

              <!-- Dot indicators & autoplay bar -->
              <div class="flex flex-col items-center gap-2 mt-5">
                <div class="flex items-center gap-2">
                  <button (click)="adIndex = 0" class="transition-all duration-300 rounded-full"
                          [ngClass]="adIndex === 0 ? 'w-7 h-2.5 bg-blue-600 shadow shadow-blue-400/40' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400'"></button>
                  <button (click)="adIndex = 1" class="transition-all duration-300 rounded-full"
                          [ngClass]="adIndex === 1 ? 'w-7 h-2.5 bg-yellow-500 shadow shadow-yellow-400/40' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400'"></button>
                </div>
                <p class="text-[9px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-[0.18em]">
                  Auto-rotating ads · 4s interval
                </p>
              </div>
            </div>

          </div>
        </main>


        <!-- Dynamic Event Types Showcase replacing Trust Bar -->
        <section id="plans-section" class="w-full max-w-7xl mx-auto px-6 mb-32 relative z-10 animate-pop-in border-t border-slate-200/30 dark:border-white/5 pt-16" style="animation-delay: 0.2s;">
            
            <div class="text-center mb-10">
                <h2 class="text-2xl md:text-3xl font-bold outfit-font text-slate-800 dark:text-white/90">Comprehensive Coverage For Any Occasion</h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Wedding -->
                <div class="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-2xl shadow-yellow-500/20 ring-1 ring-white/10">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Weddings">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <div class="w-10 h-10 rounded-full bg-yellow-500/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 border border-yellow-400/30">
                            <span class="text-yellow-300 font-bold">W</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white outfit-font mb-1 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">Weddings</h3>
                        <div class="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                          <p class="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 delay-100 pt-2">Cancellations, venues, lost rings.</p>
                        </div>
                    </div>
                </div>
                <!-- Concert -->
                <div class="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
                    <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Concerts">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <div class="w-10 h-10 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 border border-blue-400/30">
                            <span class="text-blue-300 font-bold">C</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white outfit-font mb-1 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">Concerts</h3>
                        <div class="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                           <p class="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 delay-100 pt-2">Equipment, liability, no-shows.</p>
                        </div>
                    </div>
                </div>
                <!-- Corporate -->
                <div class="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
                    <img src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=800&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Corporate Events">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <div class="w-10 h-10 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 border border-blue-400/30">
                            <span class="text-blue-300 font-bold">E</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white outfit-font mb-1 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">Corporate</h3>
                        <div class="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                            <p class="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 delay-100 pt-2">Seminars, retreats, liability.</p>
                        </div>
                    </div>
                </div>
                <!-- And Many More -->
                <div class="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-2xl shadow-rose-500/20 ring-1 ring-white/10">
                    <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="And Many More">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <div class="w-10 h-10 rounded-full bg-rose-500/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 border border-rose-400/30">
                            <span class="text-rose-300 font-bold">+</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white outfit-font mb-1 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">Many More</h3>
                        <div class="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                           <p class="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 delay-100 pt-2">Birthdays, pop-ups, galas.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Value Prop Badges -->
            <div class="mt-16 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-center bg-white/40 dark:bg-black/40 backdrop-blur-xl py-6 px-10 rounded-full border border-slate-200/50 dark:border-white/5 shadow-sm">
                <span class="flex items-center gap-3"><svg class="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> <span class="hidden sm:inline">Secure Payments</span></span>
                <span class="hidden md:inline opacity-30">&bull;</span>
                <span class="flex items-center gap-3"><svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> <span class="hidden sm:inline">Transparent Premiums</span></span>
                <span class="hidden md:inline opacity-30">&bull;</span>
                <span class="flex items-center gap-3"><svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> <span class="hidden sm:inline">Instant Claims</span></span>
            </div>
        </section>

        <!-- How It Works (4 Steps) -->
        <section class="w-full max-w-7xl mx-auto px-6 py-32 relative z-10">
          <div class="text-center mb-20 cursor-default">
            <h2 class="text-3xl md:text-4xl font-extrabold outfit-font text-slate-900 dark:text-white mb-4 tracking-tight">How it Works</h2>
            <p class="text-slate-600 dark:text-neutral-400 text-lg font-medium max-w-2xl mx-auto">Four simple steps to total peace of mind for your special day.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            
            <!-- Connecting Line -->
            <div class="hidden md:block absolute top-[48px] left-[15%] right-[15%] border-t-[3px] border-dashed border-blue-200 dark:border-blue-800"></div>

            <!-- Step 1 -->
            <div class="relative flex flex-col items-center text-center group mt-4 md:mt-0">
              <div class="w-24 h-24 rounded-full bg-white dark:bg-neutral-900 border-4 border-slate-50 dark:border-black shadow-[0_0_40px_-10px_rgba(217,70,239,0.4)] flex items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-blue-600 mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 outfit-font relative z-10">1</div>
              <h3 class="text-2xl font-bold outfit-font text-slate-900 dark:text-white mb-4 group-hover:text-yellow-500 transition-colors">Submit Details</h3>
              <p class="text-slate-600 dark:text-neutral-400 text-base leading-relaxed font-medium px-4">Submit your event details, location, risks, and budget securely.</p>
            </div>

            <!-- Step 2 -->
            <div class="relative flex flex-col items-center text-center group mt-12 md:mt-0 md:delay-100">
              <div class="w-24 h-24 rounded-full bg-white dark:bg-neutral-900 border-4 border-slate-50 dark:border-black shadow-[0_0_40px_-10px_rgba(139,92,246,0.4)] flex items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-blue-600 mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 outfit-font relative z-10">2</div>
              <h3 class="text-2xl font-bold outfit-font text-slate-900 dark:text-white mb-4 group-hover:text-blue-500 transition-colors">Admin Assignment</h3>
              <p class="text-slate-600 dark:text-neutral-400 text-base leading-relaxed font-medium px-4">Our specialized system admin automatically assigns a dedicated expert agent.</p>
            </div>

            <!-- Step 3 -->
            <div class="relative flex flex-col items-center text-center group mt-12 md:mt-0 md:delay-200">
              <div class="w-24 h-24 rounded-full bg-white dark:bg-neutral-900 border-4 border-slate-50 dark:border-black shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)] flex items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-cyan-500 mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 outfit-font relative z-10">3</div>
              <h3 class="text-2xl font-bold outfit-font text-slate-900 dark:text-white mb-4 group-hover:text-blue-500 transition-colors">Tailored Options</h3>
              <p class="text-slate-600 dark:text-neutral-400 text-base leading-relaxed font-medium px-4">Get perfectly tailored policy suggestions directly from your agent.</p>
            </div>

            <!-- Step 4 -->
            <div class="relative flex flex-col items-center text-center group mt-12 md:mt-0 md:delay-300">
              <div class="w-24 h-24 rounded-full bg-white dark:bg-neutral-900 border-4 border-slate-50 dark:border-black shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-500 mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 outfit-font relative z-10">4</div>
              <h3 class="text-2xl font-bold outfit-font text-slate-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors">Get Covered</h3>
              <p class="text-slate-600 dark:text-neutral-400 text-base leading-relaxed font-medium px-4">Select, get instant approval, pay securely & receive an active policy.</p>
            </div>

          </div>
        </section>

        <!-- Highlights (3 Cards) -->
        <section class="w-full relative z-10 py-32">
          <div class="max-w-7xl mx-auto px-6">
             <div class="text-center mb-16 text-slate-900 dark:text-white cursor-default">
                <h2 class="text-3xl md:text-4xl font-extrabold outfit-font mb-4 tracking-tight">Why Choose EventSure?</h2>
                <p class="text-base md:text-lg text-slate-600 dark:text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed">We provide the most robust coverage paired with industry-leading support to ensure your events go off without a hitch.</p>
             </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <!-- Highlight 1 -->
              <div class="bg-white dark:bg-neutral-900/50 rounded-[2.5rem] p-10 flex flex-col items-start border border-slate-100 dark:border-white/10 hover:border-yellow-500/30 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 group">
                  <div class="p-4 bg-gradient-to-br from-yellow-500/10 to-blue-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold outfit-font text-slate-900 dark:text-white mb-5 transition-colors group-hover:text-yellow-600 dark:group-hover:text-yellow-400">Lightning Fast Quotes</h3>
                  <p class="text-slate-600 dark:text-neutral-400 leading-relaxed font-medium text-[1.05rem]">Get matched with policies based on your event type, budget, and coverage needs in record time through our guided process.</p>
              </div>

              <!-- Highlight 2 -->
              <div class="bg-white dark:bg-neutral-900/50 rounded-[2.5rem] p-10 flex flex-col items-start border border-slate-100 dark:border-white/10 hover:border-blue-500/30 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 group relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:scale-150 transition-transform duration-700"></div>
                  <div class="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-blue-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold outfit-font text-slate-900 dark:text-white mb-5 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">Expert Agent Assistance</h3>
                  <p class="text-slate-600 dark:text-neutral-400 leading-relaxed font-medium text-[1.05rem]">Our dedicated agents recommend the absolute best plans—and can immediately request custom policies for highly specific hazards.</p>
              </div>

              <!-- Highlight 3 -->
              <div class="bg-white dark:bg-neutral-900/50 rounded-[2.5rem] p-10 flex flex-col items-start border border-slate-100 dark:border-white/10 hover:border-blue-500/30 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 group">
                  <div class="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  </div>
                  <h3 class="text-2xl md:text-3xl font-bold outfit-font text-slate-900 dark:text-white mb-5 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">Seamless Claims Support</h3>
                  <p class="text-slate-600 dark:text-neutral-400 leading-relaxed font-medium text-[1.05rem]">Track claims easily with a dedicated claims officer workflow purposefully designed to settle disputes swiftly and fairly.</p>
              </div>

            </div>
          </div>
        </section>

        <!-- Get A Quote CTA -->
        <section class="w-full relative z-10 pb-32">
            <div class="max-w-5xl mx-auto px-6">
                <div class="rounded-[3rem] bg-gradient-to-br from-yellow-600 via-blue-600 to-blue-700 p-1 md:p-1.5 shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)] overflow-hidden relative group">
                    <!-- Glows inside -->
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div class="bg-slate-900 dark:bg-black/90 backdrop-blur-3xl rounded-[2.8rem] px-8 py-16 md:px-16 md:py-20 text-center relative z-10 flex flex-col items-center border border-white/5">
                        <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold outfit-font text-white mb-4 drop-shadow-sm tracking-tight leading-tight">Ready to secure your event?</h2>
                        <p class="text-base md:text-lg text-slate-300 font-medium max-w-2xl mb-12 leading-relaxed">Don't wait until the unexpected occurs. Get a comprehensive, obligation-free quote tailored to your specific event needs today.</p>
                        
                        <a routerLink="/get-quote" class="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-extrabold text-xl transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 outfit-font uppercase tracking-wider relative overflow-hidden group/btn">
                            <span class="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1">Get A Free Quote</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                            <div class="absolute inset-0 bg-gradient-to-r from-yellow-100 to-blue-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-0"></div>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="w-full text-center py-10 border-t border-slate-200/50 dark:border-white/5 relative z-10">
          <p class="text-slate-500 dark:text-neutral-600 text-sm font-medium tracking-wider">&copy; 2026 EventSure Suite. All rights reserved.</p>
        </footer>

      </div>
    </div>
  `
})
/**
 * The public-facing entry point of the EventSure application.
 * Highlights the main value propositions, a four-step guide to the insurance pipeline,
 * and features interactive UI elements like Dark Mode and a dynamic Activity Ticker.
 */
export class LandingComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  adIndex = 0;
  private adIntervalId: any;

  activities = [
    "🎉 Wedding policy approved in Hyderabad!!!",
    "✅ Claim settled instantly for Corporate event",
    "✨ New policy suggestion sent for Concert",
    "💳 Payment received • Policy EVT-2026..."
  ];
  currentActivity = this.activities[0];
  activityVisible = false;
  private intervalId: any;

  /**
   * Initializes component state on load. Validates if the user browser memory already retains a
   * Dark Mode preference, setting up the global environment gracefully.
   * Then mounts the asynchronous recursive timeout for the Activity Ticker.
   */
  ngOnInit() {
    // Check initial global state for dark mode (defaults to light for existing styling)
    if (typeof document !== 'undefined') {
      this.isDarkMode = document.documentElement.classList.contains('dark');
    }

    // Activity Ticker Logic
    this.intervalId = setInterval(() => {
      this.showNextActivity();
    }, 4500);

    // Ad Carousel Auto-rotation (every 4s)
    this.adIntervalId = setInterval(() => {
      this.adIndex = (this.adIndex + 1) % 2;
    }, 4000);

    // Initial reveal
    setTimeout(() => this.activityVisible = true, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.adIntervalId) clearInterval(this.adIntervalId);
  }

  /**
   * Animates the live ticker data sequentially by rotating 
   * the visible array elements one-by-one with standard timeout delays.
   */
  showNextActivity() {
    // Hide current
    this.activityVisible = false;

    // After it animates out, change text and animate in
    setTimeout(() => {
      const currentIndex = this.activities.indexOf(this.currentActivity);
      const nextIndex = (currentIndex + 1) % this.activities.length;
      this.currentActivity = this.activities[nextIndex];
      this.activityVisible = true;
    }, 500); // 500ms matches transition-all duration
  }

  /**
   * Reverses the active Tailwind CSS Theme.
   * Modifies the <html class="dark"> DOM object at the root document level securely wrapper.
   */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Smoothly scrolls the viewport to the Plans/Coverage section.
   */
  scrollToPlans() {
    const element = document.getElementById('plans-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
