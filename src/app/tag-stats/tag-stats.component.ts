import { AfterViewInit, Component, OnInit } from '@angular/core';
import {  Inject,  PLATFORM_ID  } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-tag-stats',
  templateUrl: './tag-stats.component.html',
  styleUrl: './tag-stats.component.css'
})
export class TagStatsComponent implements OnInit, AfterViewInit {
  constructor(
    private schemaService: UploadService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadNameCounts(); // Ensure DOM is ready
      this.loadTagCounts();
    }
  }

  private initializeChart(canvasId: string, label: string, labels: string[], data: number[], backgroundColor: string, borderColor: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label,
            data,
            backgroundColor,
            borderColor,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 10 // Adjust font size as needed
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: 10 // Adjust font size as needed
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 12 // Adjust font size for legend as needed
                }
              }
            }
          },
          maintainAspectRatio: false // Allows the chart to fit into the size of the canvas
        }
        
      });
    } else {
      console.error('Failed to get canvas context for:', canvasId);
    }
  }

  loadTagCounts() {
    this.schemaService.getTagCounts().subscribe(data => {
      const tags = data.map(item => item[0]);
      const counts = data.map(item => item[1]);
      this.initializeChart('tagChart', '# of Tags', tags, counts, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
    });
  }

  loadNameCounts() {
    this.schemaService.getNameCounts().subscribe(data => {
      const names = data.map(item => item[0]);
      const counts = data.map(item => item[1]);
      this.initializeChart('nameChart', '# of Schemas', names, counts, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
    });
  }
}

