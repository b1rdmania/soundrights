
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Database, Music, Youtube, BarChart, Code, Server } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WhitePaper = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <FileText size={24} />
              <h1 className="text-3xl font-bold tracking-tight">SoundMatch AI – Technical Overview</h1>
            </div>
            <Separator className="my-4" />
          </div>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span> 
              Overview
            </h2>
            <p className="text-lg">
              SoundMatch AI enables users to <strong>find copyright-free music</strong> that sounds similar to commercial tracks. 
              It processes user-inputted songs via <strong>file upload, Spotify, or YouTube links</strong>, extracts audio features using AI, 
              and searches <strong>royalty-free music databases</strong> for similar tracks using <strong>FAISS-powered similarity search</strong>.
            </p>
          </section>

          <section className="mb-10 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span> 
              System Architecture
            </h2>
            
            <div className="rounded-lg border p-6 bg-card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Music size={20} />
                User Inputs a Song
              </h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li><strong>MP3 Upload</strong> (Directly processes the audio file)</li>
                <li><strong>Spotify Link</strong> (Fetches metadata via Spotify API)</li>
                <li><strong>YouTube Link</strong> (Extracts audio using yt-dlp)</li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 bg-card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart size={20} />
                AI Feature Extraction
              </h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li><strong>Librosa</strong> (Extracts MFCC, chroma, BPM, and spectral features)</li>
                <li><strong>Pre-processed FAISS index</strong> (For fast similarity search)</li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 bg-card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database size={20} />
                Music Matching & API Fetching
              </h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li><strong>FAISS Vector Search</strong> (Finds closest matches from pre-indexed free music libraries)</li>
                <li><strong>Pixabay API, Jamendo API, Free Music Archive (FMA)</strong> (Fetches metadata, licensing, and download links)</li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 bg-card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code size={20} />
                Display & User Interaction
              </h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Web app (React/Next.js) <strong>displays results</strong> with previews & download links</li>
              </ul>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span> 
              Tech Stack & APIs Used
            </h2>
            
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Component</TableHead>
                    <TableHead className="w-1/3">Technology / API</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Frontend</TableCell>
                    <TableCell>React / Next.js</TableCell>
                    <TableCell>User interface & interactions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Backend</TableCell>
                    <TableCell>FastAPI (Python)</TableCell>
                    <TableCell>Handles requests, processes music, runs AI model</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Audio Processing</TableCell>
                    <TableCell>Librosa (Python)</TableCell>
                    <TableCell>Extracts musical features from input songs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Similarity Search</TableCell>
                    <TableCell>FAISS (Facebook AI)</TableCell>
                    <TableCell>Finds closest matches from indexed royalty-free music</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Database</TableCell>
                    <TableCell>PostgreSQL</TableCell>
                    <TableCell>Stores track metadata & search history</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">File Handling</TableCell>
                    <TableCell>AWS S3 / GCP Storage</TableCell>
                    <TableCell>Stores user-uploaded audio files</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium" rowSpan={3}>APIs Used</TableCell>
                    <TableCell>Spotify API</TableCell>
                    <TableCell>Fetches song metadata & basic audio features</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>YouTube (yt-dlp)</TableCell>
                    <TableCell>Converts video to MP3 for processing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pixabay, Jamendo, FMA</TableCell>
                    <TableCell>Finds & fetches copyright-free music matches</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">4</span> 
              Technical Implementation Steps
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Server size={20} />
                  Step 1: Set Up Backend (FastAPI + AI Processing)
                </h3>
                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="pl-2">
                    <div>Install FastAPI, FAISS, Librosa, PostgreSQL</div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>pip install fastapi uvicorn faiss-cpu librosa yt-dlp requests psycopg2</code>
                    </pre>
                  </li>
                  <li className="pl-2">
                    <div>Set up <strong>FastAPI</strong> to handle song processing</div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>{`from fastapi import FastAPI, File, UploadFile
app = FastAPI()

@app.post("/upload")
async def upload_song(file: UploadFile = File(...)):
    song_path = f"temp/{file.filename}"
    with open(song_path, "wb") as buffer:
        buffer.write(file.file.read())
    return {"message": "File received", "path": song_path}`}</code>
                    </pre>
                  </li>
                  <li className="pl-2">
                    <div>Configure <strong>FAISS search index</strong> with a <strong>pre-processed music dataset</strong></div>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 2: Implement Feature Extraction (Librosa)</h3>
                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="pl-2">
                    <div>Load & process the song</div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>{`import librosa
import numpy as np

def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    return np.hstack([np.mean(mfcc, axis=1), np.mean(chroma, axis=1), tempo])`}</code>
                    </pre>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 3: Implement FAISS Similarity Search</h3>
                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="pl-2">
                    <div>Load <strong>indexed copyright-free songs</strong> into FAISS</div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>{`import faiss
index = faiss.read_index("music_index.faiss")`}</code>
                    </pre>
                  </li>
                  <li className="pl-2">
                    <div>Find <strong>top 5 most similar</strong> tracks to the user-uploaded song</div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>{`def find_similar_songs(query_vector, k=5):
    D, I = index.search(query_vector.reshape(1, -1), k)
    return I  # Returns indexes of matching songs`}</code>
                    </pre>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 4: Fetch Metadata & Previews from Free Music APIs</h3>
                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="pl-2">
                    <div>Call <strong>Pixabay API</strong> to get song details</div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>GET https://pixabay.com/api/music/?key=API_KEY&bpm=120&mood=happy</code>
                    </pre>
                  </li>
                  <li className="pl-2">
                    <div>Retrieve <strong>Jamendo API results</strong></div>
                    <pre className="mt-2 rounded-md bg-slate-950 p-4 text-white text-sm overflow-x-auto">
                      <code>GET https://api.jamendo.com/v3.0/tracks/?client_id=YOUR_API_KEY&bpm=120</code>
                    </pre>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Step 5: Deploy MVP</h3>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Deploy <strong>Frontend (React/Next.js) on Vercel</strong></li>
                  <li>Deploy <strong>Backend (FastAPI) on AWS Lambda / Google Cloud Run</strong></li>
                  <li>Store <strong>User-Uploaded Files on AWS S3 / Google Cloud Storage</strong></li>
                  <li>Optimize <strong>FAISS Indexing for Faster Searches</strong></li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">5</span> 
              Development Timeline
            </h2>
            
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Week</TableHead>
                    <TableHead>Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Week 1</TableCell>
                    <TableCell>Develop <strong>frontend shell</strong> (Homepage, Upload Page, Results Page)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Week 2</TableCell>
                    <TableCell>Implement <strong>audio processing + FAISS search backend</strong></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Week 3</TableCell>
                    <TableCell><strong>Integrate music APIs</strong> (Spotify, Pixabay, Jamendo)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Week 4</TableCell>
                    <TableCell>Deploy MVP and collect <strong>user feedback</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">6</span> 
              Summary of Development Lift
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 bg-card">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <Server size={16} />
                  Backend Lift:
                </div>
                <div className="ml-6">Medium (FastAPI, Librosa, FAISS, API integrations)</div>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <Code size={16} />
                  Frontend Lift:
                </div>
                <div className="ml-6">Easy (React/Next.js UI, API connections)</div>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart size={16} />
                  AI/ML Complexity:
                </div>
                <div className="ml-6">Medium-High (Feature extraction + FAISS search indexing)</div>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <Server size={16} />
                  Deployment Complexity:
                </div>
                <div className="ml-6">Medium (Cloud hosting, API scalability, storage management)</div>
              </div>
            </div>
            <div className="mt-4 font-medium text-center">
              ✅ Minimum Viable Product (MVP) achievable in ~4 weeks.
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">7</span> 
              Next Steps
            </h2>
            <ul className="space-y-2 ml-6 list-disc">
              <li><strong>Set up the test website UX ASAP</strong></li>
              <li><strong>Implement basic search using Spotify API first</strong></li>
              <li><strong>Integrate Librosa + FAISS for deep similarity matching</strong></li>
              <li><strong>Expand indexed music database to 100K+ tracks</strong></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WhitePaper;
