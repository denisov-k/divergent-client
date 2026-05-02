require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'DivergentNativeDiagnostics'
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = 'Native iOS diagnostics module that captures fatal React Native errors and exposes the last stored report to JavaScript.'
  s.homepage     = 'https://divergentclub.ru'
  s.license      = package['license']
  s.author       = 'OpenAI'
  s.platforms    = { :ios => '15.1' }
  s.source       = { git: 'https://example.invalid/divergent-native-diagnostics.git', tag: s.version.to_s }
  s.source_files = '**/*.{h,m,swift}'
  s.dependency 'ExpoModulesCore'
  s.dependency 'React-Core'
  s.swift_version = '5.4'
end
