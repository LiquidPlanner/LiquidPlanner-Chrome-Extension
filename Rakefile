directory 'pkg'
task :build => 'pkg' do
  system("git archive master --format zip --output ./pkg/lp_chrome_extension.zip")
end




task :default => :build