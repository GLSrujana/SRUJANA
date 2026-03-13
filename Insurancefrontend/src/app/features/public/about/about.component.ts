import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about',
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

      <!-- Content Wrapper -->
      <div class="relative z-10 w-full flex flex-col items-center">
        
        <!-- Custom Background Imagery Container for Entire Page -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen">
             <!-- Line Art Background Image (repeat or cover) -->
             <div class="absolute inset-0 bg-[url('/images/about-bg.png')] bg-[length:600px] opacity-[0.05] dark:opacity-[0.08]"></div>
             
             <!-- Large Logo pattern watermark 1 -->
             <img src="/images/logo-icon.png" class="absolute top-10 right-[-10%] w-[900px] h-[900px] object-contain opacity-[0.02] dark:opacity-[0.03] -rotate-12">
             
             <!-- Large Logo pattern watermark 2 -->
             <img src="/images/logo-icon.png" class="absolute top-[40%] left-[-5%] w-[600px] h-[600px] object-contain opacity-[0.02] dark:opacity-[0.03] rotate-12">
             
             <!-- Large Logo pattern watermark 3 -->
             <img src="/images/logo-icon.png" class="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] object-contain opacity-[0.02] dark:opacity-[0.03] -rotate-6">
             
             <!-- Gradient fade to merge smoothly into the rest of the page -->
             <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-indigo-50/60 dark:from-neutral-950 via-transparent to-transparent z-10"></div>
        </div>
        
        <!-- Navbar -->
        <div class="fixed top-6 w-full max-w-7xl mx-auto px-4 z-50 animate-fade-in-up">
            <nav class="flex items-center justify-between bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-none shadow-blue-500/10 rounded-3xl px-6 py-4 transition-all">
                <a routerLink="/" class="flex items-center gap-4 group cursor-pointer">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-600 to-blue-500 text-white shadow-xl shadow-yellow-500/30 border border-white/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <span class="text-3xl font-extrabold tracking-tight outfit-font text-slate-900 dark:text-white transition-colors duration-300">Event<span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600 dark:from-yellow-400 dark:to-blue-500">Sure</span></span>
                </a>
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
                    <a routerLink="/about" class="hidden sm:block text-sm font-bold outfit-font text-blue-600 dark:text-blue-400 transition-colors uppercase tracking-widest pl-2">About Us</a>

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

        <main class="w-full relative pt-40 pb-20 max-w-7xl mx-auto px-6 z-10">

            <!-- Intro Section with Image -->
            <section class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 relative">
                <!-- Text Content -->
                <div class="flex-1 lg:pr-10">
                    <h1 class="text-5xl md:text-6xl font-black outfit-font text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                        About <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600">EventSure</span>
                    </h1>
                    
                    <div class="space-y-6 text-lg text-slate-600 dark:text-neutral-400 font-medium leading-relaxed">
                        <p>
                            EventSure is a modern event insurance management platform designed to simplify how individuals and organizations protect their events from unexpected risks. Founded in 2025 by Lakshmi Srujana G, EventSure was created with the vision of bringing greater transparency, efficiency, and convenience to the event insurance process through digital technology.
                        </p>
                        <p>
                            Our platform brings together customers, agents, administrators, and claims officers within a unified ecosystem, enabling a smooth and structured workflow — from submitting insurance requests to policy approval and claim settlement.
                        </p>
                        <p>
                            By combining secure digital systems with streamlined insurance workflows, EventSure aims to make event protection more accessible, reliable, and efficient for everyone involved.
                        </p>
                    </div>
                </div>

                <!-- Image with decorations -->
                <div class="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none flex justify-center lg:justify-end">
                    <div class="absolute -inset-4 bg-gradient-to-tr from-yellow-500/20 to-blue-500/20 rounded-[3rem] blur-2xl z-0 max-w-md ml-auto"></div>
                    <div class="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 rounded-[2.5rem] p-3 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] border border-white/40 dark:border-white/10 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                        <img src="/images/indian_family_daughters.png" alt="Indian family with two daughters smiling happily" class="w-full h-auto aspect-[4/3] object-cover rounded-[2rem] object-top">
                    </div>
                </div>
            </section>


            <!-- Why EventSure (Similar to PolicyBazaar design request) -->
            <section class="mb-32">
                <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">
                    
                    <!-- Left Title Area -->
                    <div class="flex-1 relative">
                        <!-- BG soft circle decorations -->
                        <div class="absolute -top-10 -left-10 w-64 h-64 bg-yellow-100/50 dark:bg-yellow-500/5 rounded-full blur-xl -z-10"></div>
                        <div class="absolute bottom-0 right-0 w-40 h-40 bg-teal-100/50 dark:bg-teal-500/5 rounded-full blur-xl -z-10"></div>
                        
                        <h2 class="text-3xl sm:text-4xl md:text-5xl font-light text-slate-600 dark:text-neutral-400 mb-4 leading-tight">
                            What makes
                        </h2>
                        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black outfit-font text-slate-900 dark:text-white mb-4 leading-tight">
                            EventSure <span class="text-slate-500 dark:text-neutral-400 font-light">one of</span>
                        </h2>
                        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-neutral-200 mb-6 leading-tight">
                            India's favourite places
                        </h2>
                        <h2 class="text-3xl sm:text-4xl md:text-5xl font-light text-slate-600 dark:text-neutral-400 leading-tight">
                            to <span class="font-extrabold text-slate-900 dark:text-white border-b-4 border-yellow-500">buy insurance?</span>
                        </h2>
                    </div>

                    <!-- Right Cards Area -->
                    <div class="flex-1 w-full relative grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        <!-- Card 1 -->
                        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border-l-4 border-blue-500 hover:-translate-y-1 transition-transform">
                            <div class="text-3xl mb-3">🎉</div>
                            <h3 class="text-xl font-bold outfit-font text-blue-600 dark:text-blue-400 mb-2">Over 9 million</h3>
                            <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
                                customers trust us & have bought their insurance on EventSure
                            </p>
                        </div>

                        <!-- Card 2 (Offset down slightly) -->
                        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border-l-4 border-cyan-500 sm:translate-y-8 hover:-translate-y-1 transition-transform">
                            <div class="text-3xl mb-3">🔍</div>
                            <h3 class="text-xl font-bold outfit-font text-cyan-500 dark:text-cyan-400 mb-2">51 insurers</h3>
                            <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
                                partnered with us so that you can compare easily & transparently
                            </p>
                        </div>

                        <!-- Card 3 -->
                        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border-l-4 border-emerald-500 hover:-translate-y-1 transition-transform mt-8 sm:mt-0">
                            <div class="text-3xl mb-3">🤩</div>
                            <h3 class="text-xl font-bold outfit-font text-emerald-500 dark:text-emerald-400 mb-2">Great Price</h3>
                            <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
                                for all kinds of insurance plans available online
                            </p>
                        </div>

                        <!-- Card 4 (Offset down slightly) -->
                        <div class="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border-l-4 border-yellow-500 sm:translate-y-8 hover:-translate-y-1 transition-transform">
                            <div class="text-3xl mb-3">👩🏻‍💼</div>
                            <h3 class="text-xl font-bold outfit-font text-yellow-500 dark:text-yellow-400 mb-2">Claims</h3>
                            <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
                                support built in with every policy for help, when you need it the most
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <!-- What Our Customers Are Saying -->
            <section class="mb-10 pt-20 border-t border-slate-200/50 dark:border-white/5 relative">
               <div class="absolute inset-0 z-0 bg-blue-50/30 dark:bg-blue-950/10 pointer-events-none" style="clip-path: polygon(0 40%, 100% 0, 100% 100%, 0% 100%);"></div>

               <div class="relative z-10 flex flex-col md:flex-row justify-between items-end mb-12">
                   <div>
                       <h2 class="text-3xl md:text-4xl font-black outfit-font text-slate-900 dark:text-white mb-2 tracking-tight">
                           What Our Customers
                       </h2>
                       <h2 class="text-3xl md:text-4xl font-black outfit-font text-slate-900 dark:text-white relative inline-block">
                           Are Saying
                           <div class="absolute -bottom-3 left-0 w-16 h-1 bg-blue-500 rounded-full"></div>
                       </h2>
                   </div>
                   
                   <!-- Next/Prev arrows -->
                   <div class="hidden md:flex gap-4">
                        <button class="p-3 bg-white dark:bg-neutral-800 rounded-full shadow-sm text-blue-500 hover:text-blue-600 hover:bg-slate-50 transition-colors border border-slate-100 dark:border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        </button>
                        <button class="p-3 bg-white dark:bg-neutral-800 rounded-full shadow-sm text-blue-500 hover:text-blue-600 hover:bg-slate-50 transition-colors border border-slate-100 dark:border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </button>
                   </div>
               </div>

               <!-- Testimonials Grid -->
               <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                   
                   <!-- Testimonial 1 -->
                   <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center">
                       <h4 class="font-bold outfit-font text-slate-900 dark:text-white text-lg mb-6">Shraddha Sharma</h4>
                       <div class="text-4xl text-blue-500 font-serif leading-none h-6 mb-4">“</div>
                       <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed italic">
                           Very simple to use, friendly website
                       </p>
                   </div>

                   <!-- Testimonial 2 -->
                   <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center">
                       <h4 class="font-bold outfit-font text-slate-900 dark:text-white text-lg mb-6">Urvashi Solanki</h4>
                       <div class="text-4xl text-blue-500 font-serif leading-none h-6 mb-4">“</div>
                       <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed italic">
                           I did not even need help from an agent! This is very good!
                       </p>
                   </div>

                   <!-- Testimonial 3 -->
                   <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center">
                       <h4 class="font-bold outfit-font text-slate-900 dark:text-white text-lg mb-6">Bhaaskar Lokhande</h4>
                       <div class="text-4xl text-blue-500 font-serif leading-none h-6 mb-4">“</div>
                       <p class="text-sm font-medium text-slate-500 dark:text-neutral-400 leading-relaxed italic">
                           Thanks for correction done in time and really Appreciated....!! GOOD TO HAVE EVENTSURE..!! LIFE IS EASY WITH YOU..!!
                       </p>
                   </div>

               </div>

            </section>
        </main>

        <!-- Footer -->
        <footer class="w-full text-center py-10 border-t border-slate-200/50 dark:border-white/5 relative z-10 w-full mt-auto">
          <p class="text-slate-500 dark:text-neutral-600 text-sm font-medium tracking-wider">&copy; 2026 EventSure Suite. All rights reserved.</p>
        </footer>

      </div>
    </div>
  `
})
export class AboutComponent implements OnInit {
    isDarkMode = false;

    ngOnInit() {
        if (typeof document !== 'undefined') {
            const htmlClasses = document.documentElement.classList;
            this.isDarkMode = htmlClasses.contains('dark');
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        if (typeof document !== 'undefined') {
            const htmlClasses = document.documentElement.classList;
            if (this.isDarkMode) {
                htmlClasses.add('dark');
            } else {
                htmlClasses.remove('dark');
            }
        }
    }
}
